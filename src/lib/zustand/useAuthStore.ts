import { create } from "zustand";
import { persist } from "zustand/middleware";

import { isCookieLoginEnabled } from "@/utils/authUtils";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // 앱 로딩 시 인증 상태를 확인 중인지 여부
  isInitialized: boolean; // 최초 인증 체크가 완료되었는지 여부
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      isLoading: true, // 앱이 시작되면 항상 인증 확인부터 시작
      isInitialized: false, // 최초 인증 체크 전

      setAccessToken: (token) => {
        // 기존 직접 저장된 토큰들 제거 (중복 저장 방지)
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        set({
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      clearAccessToken: () => {
        // 기존 직접 저장된 토큰들도 제거
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        set({
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },
    }),
    {
      name: "auth-storage",
      // 쿠키 로그인이 비활성화된 경우에만 localStorage 사용
      skipHydration: typeof window !== "undefined" && isCookieLoginEnabled(),
      partialize: (state) => ({ accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          if (!isCookieLoginEnabled() && state.accessToken) {
            // 로컬 스토리지에서 accessToken을 가져온 경우 인증 상태 업데이트
            state.isAuthenticated = true;
            state.isLoading = false;
            state.isInitialized = true;
          } else {
            // accessToken이 없거나 쿠키 로그인이 활성화된 경우
            state.isLoading = false;
            state.isInitialized = true;
          }
        }
      },
    },
  ),
);

export default useAuthStore;
