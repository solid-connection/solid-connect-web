import { create } from "zustand";
import { persist } from "zustand/middleware";

type RefreshStatus = "idle" | "refreshing" | "success" | "failed";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  refreshStatus: RefreshStatus;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setRefreshStatus: (status: RefreshStatus) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      refreshStatus: "idle",

      setAccessToken: (token) => {
        set({
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          refreshStatus: "success",
        });
      },

      clearAccessToken: () => {
        set({
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          refreshStatus: "idle",
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },

      setRefreshStatus: (status) => {
        set({ refreshStatus: status });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
