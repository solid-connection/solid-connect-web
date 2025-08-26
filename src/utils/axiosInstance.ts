import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/zustand/useTokenStore";

// --- 타입 정의 ---
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// --- 상태 관리 변수 ---
let isRedirecting = false;
let tokenRefreshPromise: Promise<string | null> | null = null;

// --- 유틸리티 함수 ---
const redirectToLogin = (message: string) => {
  if (typeof window !== "undefined" && !isRedirecting) {
    isRedirecting = true;
    clearAccessToken();
    alert(message);
    window.location.href = "/login";
  }
};

export const convertToBearer = (token: string) => `Bearer ${token}`;

// --- Axios 인스턴스 ---
export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

// --- 핵심 로직: 토큰 재발급 ---
const reissueAccessToken = (): Promise<string | null> => {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await publicAxiosInstance.post<{ accessToken: string }>("/auth/reissue");
      const newAccessToken = response.data.accessToken;

      if (!newAccessToken) throw new Error("재발급된 토큰이 유효하지 않습니다.");

      setAccessToken(newAccessToken);
      resolve(newAccessToken);
    } catch (error) {
      redirectToLogin("세션이 만료되었습니다. 다시 로그인해주세요.");
      reject(error);
    } finally {
      tokenRefreshPromise = null;
    }
  });

  return tokenRefreshPromise;
};

// --- 인터셉터 설정 ---

// 1. 요청 인터셉터 (문지기 역할)
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken();

    // 토큰이 아예 없는 경우 (새로고침 직후 등)
    if (!accessToken) {
      try {
        // 재발급을 시도하고, 성공하면 새 토큰을 가져옵니다.
        // 다른 요청들도 이 결과를 기다립니다.
        const newAccessToken = await reissueAccessToken();
        if (newAccessToken) {
          accessToken = newAccessToken;
        }
      } catch (error) {
        // 재발급 실패 시 요청을 보내지 않고 바로 에러 처리
        return Promise.reject(error);
      }
    }

    // 유효한 토큰을 헤더에 추가하여 요청을 보냅니다.
    if (accessToken) {
      config.headers.Authorization = convertToBearer(accessToken);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 2. 응답 인터셉터 (해결사 역할)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 401 에러이고, 재시도한 요청이 아닐 때만 실행
    // (토큰이 있었지만 서버에서 만료되었다고 판정한 경우)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

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
