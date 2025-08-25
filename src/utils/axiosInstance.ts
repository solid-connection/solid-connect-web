import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/zustand/useTokenStore";

// --- Axios 요청 설정에 _retry 플래그를 추가하기 위한 타입 확장 ---
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// --- 중복 리다이렉션 방지 플래그 ---
let isRedirecting = false;

const redirectToLogin = (message?: string) => {
  if (typeof window !== "undefined" && !isRedirecting) {
    isRedirecting = true;
    clearAccessToken(); // 토큰 정리
    if (message) {
      alert(message);
    }
    window.location.href = "/login";
  }
};

const redirectToLoginWithSessionExpired = () => {
  redirectToLogin("세션이 만료되었습니다. 다시 로그인해주세요.");
};

export const convertToBearer = (token: string) => `Bearer ${token}`;

// --- Public Axios 인스턴스 (토큰 재발급용) ---
export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

// --- 토큰 재발급 로직 ---
let tokenRefreshPromise: Promise<string | null> | null = null;

const reissueAccessToken = (): Promise<string | null> => {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await publicAxiosInstance.post<{ accessToken: string }>("/auth/reissue");
      const newToken = response.data.accessToken;

      if (!newToken) {
        throw new Error("재발급된 토큰이 없습니다.");
      }

      setAccessToken(newToken);
      resolve(newToken);
    } catch (error) {
      redirectToLoginWithSessionExpired();
      reject(error);
    } finally {
      tokenRefreshPromise = null;
    }
  });

  return tokenRefreshPromise;
};

// --- Private Axios 인스턴스 (일반 API 요청용) ---
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

// --- 요청 인터셉터 ---
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = convertToBearer(accessToken);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- 응답 인터셉터 ---
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // `error.config`를 우리가 정의한 커스텀 타입으로 간주합니다.
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 요청임을 표시

      try {
        const newAccessToken = await reissueAccessToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = convertToBearer(newAccessToken);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
