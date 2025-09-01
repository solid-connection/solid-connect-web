import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import useAuthStore from "@/lib/zustand/useAuthStore";

// --- 타입 정의 ---
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// --- 상태 관리 변수 ---
let isRedirecting = false;
// 여러 요청이 동시에 토큰 재발급을 시도하는 것을 방지하기 위한 Promise
let tokenRefreshPromise: Promise<string> | null = null;

// --- 유틸리티 함수 ---
const redirectToLogin = (message: string) => {
  if (typeof window !== "undefined" && !isRedirecting) {
    isRedirecting = true;
    // Zustand 스토어의 상태를 초기화
    useAuthStore.getState().clearAuth();
    alert(message);
    window.location.href = "/login";
  }
};

export const convertToBearer = (token: string) => `Bearer ${token}`;

// --- Axios 인스턴스 ---
// 인증이 필요 없는 공용 API 요청에 사용
export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

// 인증이 필요한 모든 API 요청에 사용
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

/**
 * 액세스 토큰을 재발급하는 핵심 함수.
 * 중복 호출을 방지하기 위해 Promise 기반으로 구현.
 * 이 함수는 앱 내에서 유일한 토큰 재발급 로직이어야 합니다.
 */
export const reissueAccessToken = (): Promise<string> => {
  // 이미 재발급 요청이 진행 중이라면, 기존 Promise를 반환하여 중복 요청을 막음
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await publicAxiosInstance.post<{ accessToken: string }>("/auth/reissue");
      const newAccessToken = response.data.accessToken;

      if (!newAccessToken) {
        throw new Error("재발급된 토큰이 유효하지 않습니다.");
      }

      // 재발급 성공 시, 새로운 토큰을 Zustand 스토어에 저장
      useAuthStore.getState().setToken(newAccessToken);
      resolve(newAccessToken);
    } catch (error) {
      const errorStatus = (error as AxiosError).response?.status;
      if (errorStatus === 401) {
        redirectToLogin("세션이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        redirectToLogin("로그인이 필요합니다.");
      }
      // 재발급 실패 시 로그인 페이지로 리디렉션
      reject(error);
    } finally {
      // Promise 처리가 끝나면 다시 null로 설정하여 다음 재발급 요청을 받을 수 있게 함
      tokenRefreshPromise = null;
    }
  });

  return tokenRefreshPromise;
};

// --- 인터셉터 설정 ---

// 1. 요청 인터셉터 (Request Interceptor)
//    역할: API 요청을 보내기 직전, Zustand 스토어에 있는 액세스 토큰을 헤더에 추가.
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = convertToBearer(accessToken);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. 응답 인터셉터 (Response Interceptor)
//    역할: API 요청이 401 Unauthorized 에러로 실패했을 때, 토큰 재발급을 시도하고 원래 요청을 재시도.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 401 에러이고, 재시도한 요청이 아닐 때만 실행
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정 (무한 재시도 방지)

      try {
        const newAccessToken = await reissueAccessToken();
        // 재발급된 토큰으로 원래 요청의 헤더를 교체
        originalRequest.headers.Authorization = convertToBearer(newAccessToken);
        // 원래 요청을 다시 시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 시, 에러를 그대로 반환
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
