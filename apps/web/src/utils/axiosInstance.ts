import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { postReissueToken } from "@/apis/Auth/server";
import { QueryKeys } from "@/apis/queryKeys";
import queryClient from "@/lib/react-query/queryClient";
import { setPendingToast } from "@/lib/toast/pendingToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { isTokenExpired } from "@/utils/jwtUtils";

// --- 글로벌 변수 ---
let refreshRequest: { sessionVersion: number; promise: Promise<string | null> } | null = null;
type AuthRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean; _sessionVersion?: number };

export class AuthenticationChangedError extends Error {
  constructor() {
    super("Authentication changed while the request was pending");
    this.name = "AuthenticationChangedError";
  }
}

// --- 커스텀 에러 클래스 ---
export class AuthenticationRequiredError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationRequiredError";
  }
}

// --- 상태 관리 변수 ---
let isRedirecting = false;

const clearAuthState = () => {
  useAuthStore.getState().clearAccessToken();
  queryClient.removeQueries({ queryKey: [QueryKeys.MyPage.profile] });
  queryClient.removeQueries({ queryKey: ["chat"] });
};

// --- 유틸리티 함수 ---
const redirectToLogin = (message: string) => {
  if (typeof window !== "undefined" && !isRedirecting) {
    isRedirecting = true;
    // Zustand 스토어 및 쿠키 상태 초기화
    clearAuthState();
    try {
      // 쿠키 유틸이 클라이언트에서만 동작하므로 window 가드 내에서 호출
    } catch {}
    // location.replace 는 하드 내비게이션이라 여기서 토스트를 띄우면 화면에 뜨기 전에 사라진다.
    // 로그인 페이지에 도착한 뒤 PendingToastPresenter 가 대신 띄우도록 넘긴다.
    setPendingToast("logo", message);
    window.location.replace("/login");
  }
};

export const convertToBearer = (token: string) => `Bearer ${token}`;

// The raw API only returns credentials. This owner alone may commit or clear the active session.
export const refreshAccessToken = (): Promise<string | null> => {
  const auth = useAuthStore.getState();
  if (refreshRequest?.sessionVersion === auth.sessionVersion) return refreshRequest.promise;
  const request = { sessionVersion: auth.sessionVersion, promise: Promise.resolve<string | null>(null) };
  let ownedVersion = auth.sessionVersion;
  const isCurrentSession = () => useAuthStore.getState().sessionVersion === ownedVersion;
  request.promise = (async () => {
    auth.setRefreshStatus("refreshing");
    auth.setLoading(true);
    try {
      const token = await postReissueToken();
      if (!isCurrentSession()) throw new AuthenticationChangedError();
      useAuthStore.getState().setRefreshedAccessToken(token, ownedVersion);
      return token;
    } catch (error) {
      if (!isCurrentSession()) throw new AuthenticationChangedError();
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) {
        clearAuthState();
        ownedVersion = useAuthStore.getState().sessionVersion;
        useAuthStore.getState().setRefreshStatus("failed");
        return null;
      }
      useAuthStore.getState().setRefreshStatus("retryable");
      throw error;
    } finally {
      if (isCurrentSession()) {
        useAuthStore.getState().setLoading(false);
        useAuthStore.getState().setInitialized(true);
      }
      if (refreshRequest === request) refreshRequest = null;
    }
  })();
  refreshRequest = request;
  return request.promise;
};

// HTTP requests, authentication initialization and socket reconnects share one refresh request.
export const getValidAccessToken = async (): Promise<string | null> => {
  const auth = useAuthStore.getState();
  if (refreshRequest?.sessionVersion === auth.sessionVersion) return refreshRequest.promise;
  const { accessToken: token, refreshStatus } = auth;
  if (refreshStatus === "failed") return null;
  // A token rejected by the server remains unusable even if its exp has not passed.
  if (token && !isTokenExpired(token) && refreshStatus !== "retryable") return token;
  return refreshAccessToken();
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
    const sessionVersion = useAuthStore.getState().sessionVersion;
    const token = await getValidAccessToken();
    const currentAuth = useAuthStore.getState();
    if (
      sessionVersion !== currentAuth.sessionVersion &&
      (token !== null || currentAuth.refreshStatus !== "failed" || currentAuth.isAuthenticated)
    )
      throw new AuthenticationChangedError();
    (config as AuthRequestConfig)._sessionVersion = sessionVersion;
    if (token) {
      config.headers.Authorization = convertToBearer(token);
      return config;
    }
    if (useAuthStore.getState().isInitialized) {
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
      const originalRequest = error.config as AuthRequestConfig | undefined;
      if (originalRequest?._sessionVersion !== useAuthStore.getState().sessionVersion) {
        return Promise.reject(new AuthenticationChangedError());
      }

      if (originalRequest && !originalRequest._retry && useAuthStore.getState().refreshStatus !== "failed") {
        originalRequest._retry = true;

        try {
          const reissuedAccessToken = await refreshAccessToken();

          if (reissuedAccessToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = convertToBearer(reissuedAccessToken);
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Temporary failures keep the local session and let the caller retry.
          return Promise.reject(refreshError);
        }
      }

      redirectToLogin("세션이 만료되었습니다. 다시 로그인해주세요.");
    }

    return Promise.reject(error);
  },
);
