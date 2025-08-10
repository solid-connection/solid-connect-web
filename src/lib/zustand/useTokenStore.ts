import { create } from "zustand";

interface TokenStore {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  hasToken: () => boolean;
}

// 메모리 전용 토큰 스토어
export const useTokenStore = create<TokenStore>((set, get) => ({
  accessToken: null,

  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },

  clearAccessToken: () => {
    set({ accessToken: null });
  },

  hasToken: () => {
    const { accessToken } = get();
    const hasToken = !!accessToken;
    return hasToken;
  },
}));

// 컴포넌트 외부에서 사용할 수 있는 헬퍼 함수들
export const getAccessToken = () => {
  const token = useTokenStore.getState().accessToken;
  return token;
};
export const setAccessToken = (token: string) => {
  useTokenStore.getState().setAccessToken(token);
};
export const clearAccessToken = () => useTokenStore.getState().clearAccessToken();
export const hasToken = () => useTokenStore.getState().hasToken();
