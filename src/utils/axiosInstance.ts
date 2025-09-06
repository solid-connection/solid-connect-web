import axios, { AxiosError, AxiosInstance } from "axios";

import { isCookieLoginEnabled } from "./authUtils";
import { getAccessTokenFromLS } from "./localStorageUtils";

import useAuthStore from "@/lib/zustand/useAuthStore";

// --- 커스텀 에러 클래스 ---
export class AuthenticationRequiredError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationRequiredError";
  }
}

// --- 상태 관리 변수 ---
let isRedirecting = false;

// --- 유틸리티 함수 ---
const redirectToLogin = (message: string) => {
  if (typeof window !== "undefined" && !isRedirecting) {
    isRedirecting = true;
    // Zustand 스토어의 상태를 초기화
    useAuthStore.getState().clearAccessToken();
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

// --- 인터셉터 설정 ---

// 1. 요청 인터셉터 (Request Interceptor)
//    역할: API 요청을 보내기 직전, Zustand 스토어에 있는 액세스 토큰을 헤더에 추가.
axiosInstance.interceptors.request.use(
  (config) => {
    let accessToken;

    // 쿠키 모드인 경우 로컬스토리지에서, 아니면 Zustand 스토어에서 토큰 가져오기
    if (isCookieLoginEnabled()) {
      accessToken = getAccessTokenFromLS();
    } else {
      accessToken = useAuthStore.getState().accessToken;
    }

    const isInitialized = useAuthStore.getState().isInitialized;

    if (accessToken) {
      config.headers.Authorization = convertToBearer(accessToken as string);
      return config;
    } else if (isInitialized) {
      // ReissueProvider가 초기화를 완료했는데도 토큰이 없다면 로그인이 필요
      redirectToLogin("로그인이 필요합니다. 다시 로그인해주세요.");
      return Promise.reject(new AuthenticationRequiredError());
    }
    // isInitialized가 false인 경우는 아직 초기화 중이므로 토큰 없이도 요청 진행

    return config;
  },
  (error) => Promise.reject(error),
);

// 2. 응답 인터셉터 (Response Interceptor)
//    역할: 401 에러 시 로그인 페이지로 리다이렉트
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401 에러 시 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      redirectToLogin("세션이 만료되었습니다. 다시 로그인해주세요.");
    }

    return Promise.reject(error);
  },
);
