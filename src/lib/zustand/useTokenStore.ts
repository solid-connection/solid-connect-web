import { create } from "zustand";

import { isCookieLoginEnabled } from "@/utils/localStorage";
import {
  loadAccessTokenFromLS,
  loadRefreshTokenFromLS,
  removeAccessTokenFromLS,
  saveAccessTokenToLS,
} from "@/utils/localStorageUtils";

// JWT 토큰 만료 확인을 위한 간단한 함수 (순환 import 방지)
const isTokenExpiredSimple = (token: string | null): boolean => {
  if (!token) return true;

  try {
    // JWT의 payload 부분을 디코딩
    const base64UrlDecode = (str: string): string => {
      let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      return atob(base64);
    };

    const payload = JSON.parse(base64UrlDecode(token.split(".")[1])) as { exp: number };
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

interface TokenStore {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  hasToken: () => boolean;
}

// 메모리 전용 토큰 스토어 (쿠키 모드) 또는 로컬스토리지 연동 스토어 (로컬스토리지 모드)
export const useTokenStore = create<TokenStore>((set, get) => ({
  accessToken: null,

  setAccessToken: (token: string) => {
    const next = token?.trim();
    const finalToken = next && next.length > 0 ? next : null;

    // 상태 업데이트
    set({ accessToken: finalToken });

    // 로컬스토리지 모드일 때만 로컬스토리지에 저장
    if (!isCookieLoginEnabled() && finalToken) {
      saveAccessTokenToLS(finalToken);
    }
  },

  clearAccessToken: () => {
    set({ accessToken: null });

    // 로컬스토리지 모드일 때만 로컬스토리지에서 제거
    if (!isCookieLoginEnabled()) {
      removeAccessTokenFromLS();
    }
  },

  hasToken: () => {
    const { accessToken } = get();
    const hasToken = !!accessToken;
    return hasToken;
  },
}));

// 토큰 reissue 상태 관리 (중복 요청 방지)
let isReissuingToken = false;

// reissue 함수 (순환 import 방지를 위해 여기서 직접 구현)
const reissueTokenInternal = async (): Promise<string | null> => {
  if (isReissuingToken) {
    // 이미 reissue 중이면 기다렸다가 현재 토큰 반환
    await new Promise((resolve) => setTimeout(resolve, 100));
    return useTokenStore.getState().accessToken;
  }

  isReissuingToken = true;

  try {
    let response: { data: { accessToken: string } };

    if (isCookieLoginEnabled()) {
      // 쿠키 모드: HTTP-only 쿠키를 통해 reissue
      const axios = (await import("axios")).default;
      response = await axios.post<{ accessToken: string }>(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
        {},
        { withCredentials: true },
      );
    } else {
      // 로컬스토리지 모드: 리프레시 토큰으로 reissue
      const refreshToken = loadRefreshTokenFromLS();
      if (!refreshToken) {
        return null;
      }

      const axios = (await import("axios")).default;
      response = await axios.post<{ accessToken: string }>(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        },
      );
    }

    const newToken: string = response.data.accessToken;
    useTokenStore.getState().setAccessToken(newToken);
    return newToken;
  } catch {
    return null;
  } finally {
    isReissuingToken = false;
  }
};

// 컴포넌트 외부에서 사용할 수 있는 헬퍼 함수들 (동기 버전 - 기존 호환성 유지)
export const getAccessToken = (): string | null => {
  let token: string | null = null;

  // 현재 토큰 가져오기
  if (isCookieLoginEnabled()) {
    // 쿠키 모드: Zustand 스토어에서 가져오기
    token = useTokenStore.getState().accessToken;
  } else {
    // 로컬스토리지 모드: 로컬스토리지에서 직접 가져오기
    const lsToken = loadAccessTokenFromLS();
    const storeToken = useTokenStore.getState().accessToken;

    // 로컬스토리지에 토큰이 있지만 스토어에 없으면 스토어 동기화
    if (lsToken && !storeToken) {
      useTokenStore.getState().setAccessToken(lsToken);
      token = lsToken;
    } else {
      token = storeToken;
    }
  }

  // 토큰이 문자열이고 공백이 아닌 경우에만 반환
  return typeof token === "string" && token.trim() !== "" ? token : null;
};

// 토큰 자동 갱신 포함 버전 (비동기)
export const getAccessTokenWithReissue = async (): Promise<string | null> => {
  const token = getAccessToken();

  // 토큰이 없거나 만료되었으면 reissue 시도
  if (!token || isTokenExpiredSimple(token)) {
    const newToken = await reissueTokenInternal();
    return newToken;
  }

  return token;
};

export const setAccessToken = (token: string) => {
  useTokenStore.getState().setAccessToken(token);
};

export const clearAccessToken = () => {
  useTokenStore.getState().clearAccessToken();
};

export const hasToken = () => useTokenStore.getState().hasToken();
