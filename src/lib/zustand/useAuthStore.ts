import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // 앱 로딩 시 인증 상태를 확인 중인지 여부
  setToken: (token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // 앱이 시작되면 항상 인증 확인부터 시작

  setToken: (token) => {
    set({
      accessToken: token,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    set({
      accessToken: null,
      isAuthenticated: false,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));

export default useAuthStore;
