import { create } from "zustand";

import { isCookieLoginEnabled } from "@/utils/localStorage";
import { loadAccessTokenFromLS, removeAccessTokenFromLS, saveAccessTokenToLS } from "@/utils/localStorageUtils";

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

// 컴포넌트 외부에서 사용할 수 있는 헬퍼 함수들
export const getAccessToken = (): string | null => {
  // 쿠키 모드: Zustand 스토어에서 가져오기
  if (isCookieLoginEnabled()) {
    return useTokenStore.getState().accessToken;
  }

  // 로컬스토리지 모드: 로컬스토리지에서 직접 가져오기
  const lsToken = loadAccessTokenFromLS();
  const storeToken = useTokenStore.getState().accessToken;

  // 로컬스토리지에 토큰이 있지만 스토어에 없으면 스토어 동기화
  if (lsToken && !storeToken) {
    useTokenStore.getState().setAccessToken(lsToken);
    return lsToken;
  }

  return storeToken;
};

export const setAccessToken = (token: string) => {
  useTokenStore.getState().setAccessToken(token);
};

export const clearAccessToken = () => {
  useTokenStore.getState().clearAccessToken();
};

export const hasToken = () => useTokenStore.getState().hasToken();
