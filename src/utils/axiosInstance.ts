import axios, { AxiosError, AxiosHeaders, AxiosInstance } from "axios";

import { isTokenExpired } from "./jwtUtils";
import { isCookieLoginEnabled } from "./localStorage";
import { clearAllTokensFromLS, loadRefreshTokenFromLS } from "./localStorageUtils";

import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/zustand/useTokenStore";

// 간단한 세마포어 구현
class Semaphore {
  private permits: number;
  private waitQueue: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (this.permits > 0) {
        this.permits--;
        resolve();
      } else {
        this.waitQueue.push(resolve);
      }
    });
  }

  release(): void {
    if (this.waitQueue.length > 0) {
      const resolve = this.waitQueue.shift();
      if (resolve) {
        resolve();
      }
    } else {
      this.permits++;
    }
  }
}

// 토큰 갱신용 세마포어 (동시에 1개만 허용)
const tokenRefreshSemaphore = new Semaphore(1);

// 토큰 갱신 실패 상태 관리
let lastRefreshFailed = false;
let lastRefreshTime = 0;
const REFRESH_RETRY_DELAY = 30000; // 30초

// 로그인 페이지 리다이렉트 (중복 호출 방지)
let isRedirecting = false;

const redirectToLogin = (message?: string) => {
  if (typeof window !== "undefined" && !isRedirecting) {
    isRedirecting = true;
    if (message) {
      alert(message);
    }

    // 로그아웃 시 토큰 정리
    if (isCookieLoginEnabled()) {
      clearAccessToken();
    } else {
      clearAllTokensFromLS();
      clearAccessToken();
    }

    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  }
};

const redirectToLoginWithSessionExpired = () => {
  redirectToLogin("세션이 만료되었습니다");
};

const redirectToLoginWithAuthRequired = () => {
  redirectToLogin("로그인이 필요합니다");
};

export const convertToBearer = (token: string) => `Bearer ${token}`;

const reissueAccessToken = async (): Promise<string | null> => {
  // 최근에 실패했다면 재시도하지 않음
  const now = Date.now();
  if (lastRefreshFailed && now - lastRefreshTime < REFRESH_RETRY_DELAY) {
    return null;
  }

  await tokenRefreshSemaphore.acquire();

  try {
    // 세마포어 획득 후 다시 한번 실패 상태 체크
    const nowAfterAcquire = Date.now();
    if (lastRefreshFailed && nowAfterAcquire - lastRefreshTime < REFRESH_RETRY_DELAY) {
      return null;
    }

    // 갱신 시작 전에 현재 토큰 상태 다시 확인
    const currentToken = getAccessToken();
    if (currentToken && !isTokenExpired(currentToken)) {
      lastRefreshFailed = false;
      return currentToken;
    }

    let response;

    if (isCookieLoginEnabled()) {
      // 쿠키 모드: HTTP-only 쿠키를 통해 리프레시 토큰 자동 전송
      response = await publicAxiosInstance.post<{ accessToken: string }>("/auth/reissue");
    } else {
      // 로컬스토리지 모드: 리프레시 토큰을 헤더에 포함하여 전송
      const refreshToken = loadRefreshTokenFromLS();
      if (!refreshToken) {
        throw new Error("리프레시 토큰이 없습니다");
      }

      response = (await axios.post<{ accessToken: string }>(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      )) as { data: { accessToken: string } };
    }

    const newToken = response.data.accessToken;
    setAccessToken(newToken);
    lastRefreshFailed = false;
    return newToken;
  } catch {
    lastRefreshFailed = true;
    lastRefreshTime = Date.now();
    return null;
  } finally {
    tokenRefreshSemaphore.release();
  }
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: isCookieLoginEnabled(), // 쿠키 모드일 때만 true
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const newConfig = { ...config };
    let accessToken: string | null = getAccessToken();

    if (accessToken === null || isTokenExpired(accessToken)) {
      // 토큰이 처음부터 없는 경우
      if (accessToken === null) {
        clearAccessToken();
        redirectToLoginWithAuthRequired();
        throw new Error("로그인이 필요합니다");
      }

      // 토큰이 만료된 경우 갱신 시도
      try {
        const newToken = await reissueAccessToken();
        if (newToken) {
          accessToken = newToken;
        } else {
          clearAccessToken();
          redirectToLoginWithSessionExpired();
          throw new Error("세션이 만료되었습니다");
        }
      } catch (error) {
        clearAccessToken();
        redirectToLoginWithSessionExpired();
        throw error instanceof Error ? error : new Error("세션이 만료되었습니다");
      }
    }

    if (accessToken !== null) {
      newConfig.headers.Authorization = convertToBearer(accessToken);
    }
    return newConfig;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        const newAccessToken = await reissueAccessToken();
        if (newAccessToken) {
          if (error.config) {
            if (!error.config.headers) {
              error.config.headers = new AxiosHeaders();
            }
            error.config.headers.Authorization = convertToBearer(newAccessToken);
            return await axios.request(error.config);
          }
        } else {
          clearAccessToken();
          redirectToLoginWithSessionExpired();
          throw new Error("세션이 만료되었습니다");
        }
      } catch (refreshError) {
        clearAccessToken();
        redirectToLoginWithSessionExpired();
        throw refreshError instanceof Error ? refreshError : new Error("세션이 만료되었습니다");
      }
    } else {
      throw error;
    }
  },
);

export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: isCookieLoginEnabled(), // 쿠키 모드일 때만 HTTP-only 쿠키 포함
});
