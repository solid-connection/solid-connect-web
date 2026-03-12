import axios, { type AxiosError, type AxiosInstance } from "axios";

import { postReissueToken } from "@/apis/Auth/server";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";

// --- 글로벌 변수 ---
let reissuePromise: Promise<void> | null = null;

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
    // Zustand 스토어 및 쿠키 상태 초기화
    useAuthStore.getState().clearAccessToken();
    try {
      // 쿠키 유틸이 클라이언트에서만 동작하므로 window 가드 내에서 호출
    } catch {}
    toast.error(message);
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
axiosInstance.interceptors.request.use(
  async (config) => {
    const { accessToken, setLoading, clearAccessToken, setInitialized, refreshStatus, setRefreshStatus } =
      useAuthStore.getState();

    // 토큰이 있으면 헤더에 추가하고 진행
    if (accessToken) {
      config.headers.Authorization = convertToBearer(accessToken);
      return config;
    }

    if (refreshStatus !== "failed") {
      try {
        // 이미 reissue가 진행 중인지 확인
        if (reissuePromise) {
          await reissuePromise;
        } else {
          // 새로운 reissue 프로세스 시작 (HTTP-only 쿠키의 refreshToken 사용)
          reissuePromise = (async () => {
            setRefreshStatus("refreshing");
            setLoading(true);
            try {
              await postReissueToken();
              setRefreshStatus("success");
            } catch {
              clearAccessToken();
              setRefreshStatus("failed");
            } finally {
              setLoading(false);
              setInitialized(true);
              reissuePromise = null;
            }
          })();

          await reissuePromise;
        }

        // reissue 완료 후 업데이트된 토큰으로 헤더 설정
        const updatedAccessToken = useAuthStore.getState().accessToken;
        if (updatedAccessToken) {
          config.headers.Authorization = convertToBearer(updatedAccessToken);
        }
      } catch {
        // 에러 발생 시에도 상태 정리는 promise 내부의 finally에서 처리됨
      }

      // reissue 후 토큰이 있으면 헤더에 추가
      const finalAccessToken = useAuthStore.getState().accessToken;
      if (finalAccessToken) {
        config.headers.Authorization = convertToBearer(finalAccessToken);
        return config;
      }
    }

    const { isInitialized: currentInitialized, accessToken: currentAccessToken } = useAuthStore.getState();

    // 초기화는 되었지만 토큰이 없는 경우 로그인 필요
    if (currentInitialized && !currentAccessToken) {
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
