import axios, { type AxiosError, type AxiosInstance } from "axios";

import { postReissueToken } from "@/apis/Auth/server";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";
import { isTokenExpired } from "@/utils/jwtUtils";

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

const tryReissueAccessToken = async (): Promise<string | null> => {
  if (reissuePromise) {
    await reissuePromise;
    return useAuthStore.getState().accessToken;
  }

  const { setLoading, clearAccessToken, setInitialized, setRefreshStatus } = useAuthStore.getState();

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
  return useAuthStore.getState().accessToken;
};

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
    const { accessToken, clearAccessToken, refreshStatus } = useAuthStore.getState();

    // 만료된 access token은 즉시 제거하고 refresh 재발급 경로를 타게 한다.
    if (accessToken && isTokenExpired(accessToken)) {
      clearAccessToken();
    }

    const validAccessToken = useAuthStore.getState().accessToken;

    // 토큰이 있으면 헤더에 추가하고 진행
    if (validAccessToken) {
      config.headers.Authorization = convertToBearer(validAccessToken);
      return config;
    }

    if (refreshStatus !== "failed") {
      try {
        await tryReissueAccessToken();

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
//    역할: 401 에러 시 access 재발급 1회 재시도 후 실패하면 로그인 페이지로 리다이렉트
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

      if (originalRequest && !originalRequest._retry && useAuthStore.getState().refreshStatus !== "failed") {
        originalRequest._retry = true;

        try {
          const reissuedAccessToken = await tryReissueAccessToken();

          if (reissuedAccessToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = convertToBearer(reissuedAccessToken);
            return axiosInstance(originalRequest);
          }
        } catch {
          // 재발급 실패 시 아래 로그인 리다이렉트로 처리
        }
      }

      redirectToLogin("세션이 만료되었습니다. 다시 로그인해주세요.");
    }

    return Promise.reject(error);
  },
);
