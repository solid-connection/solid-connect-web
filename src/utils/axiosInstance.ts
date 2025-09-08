import axios, { AxiosError, AxiosInstance } from "axios";

import { hasIsPrevLoginCookie } from "@/utils/authCookieUtils";
import { isCookieLoginEnabled } from "@/utils/authUtils";

import postReissueToken from "@/api/auth/server/postReissueToken";
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
//    토큰이 없고 초기화되지 않은 경우 자동으로 reissue 시도.
axiosInstance.interceptors.request.use(
  async (config) => {
    const { accessToken, isInitialized, setLoading, clearAccessToken, setInitialized } = useAuthStore.getState();

    // 토큰이 있으면 헤더에 추가하고 진행
    if (accessToken) {
      config.headers.Authorization = convertToBearer(accessToken);
      return config;
    }

    console.log("accessToken", accessToken);
    console.log("isInitialized", isInitialized);
    // 토큰이 없고 아직 초기화되지 않은 경우 reissue 시도
    if (!isInitialized) {
      try {
        setLoading(true);

        // 쿠키 로그인이 활성화되고 isPrevLogin 쿠키가 있는 경우에만 reissue 시도
        if (isCookieLoginEnabled() && hasIsPrevLoginCookie()) {
          console.log("Attempting token reissue...");
          await postReissueToken();
          console.log("Token reissue successful");

          // reissue 성공 후 새로운 토큰으로 헤더 설정
          const newAccessToken = useAuthStore.getState().accessToken;
          if (newAccessToken) {
            config.headers.Authorization = convertToBearer(newAccessToken);
          }
        } else {
          console.log("No previous login found or cookie login disabled");
          clearAccessToken();
        }
      } catch (error) {
        console.log("Token reissue failed:", error);
        clearAccessToken();
      } finally {
        setLoading(false);
        setInitialized(true);
      }

      // reissue 후 토큰이 있으면 헤더에 추가
      const finalAccessToken = useAuthStore.getState().accessToken;
      if (finalAccessToken) {
        config.headers.Authorization = convertToBearer(finalAccessToken);
        return config;
      }
    }

    // 초기화는 되었지만 토큰이 없는 경우 로그인 필요
    if (isInitialized && !accessToken) {
      redirectToLogin("로그인이 필요합니다. 다시 로그인해주세요.");
      return Promise.reject(new AuthenticationRequiredError());
    }

    // 초기화 중이거나 토큰 없이도 진행 가능한 요청
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
