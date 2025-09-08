import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
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
      isLoading: false,
      isInitialized: false,

      setAccessToken: (token) => {
        set({
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      clearAccessToken: () => {
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
      name: "auth-storage", // localStorage에 저장될 키 이름
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }), // accessToken과 isAuthenticated만 localStorage에 저장
    },
  ),
);

export default useAuthStore;
