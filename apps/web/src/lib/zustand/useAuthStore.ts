import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types/mentor";
import { authDebugLog } from "@/utils/authDebug";

const parseUserRoleFromToken = (token: string | null): UserRole | null => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { role?: string };

    if (payload.role === UserRole.MENTOR || payload.role === UserRole.MENTEE || payload.role === UserRole.ADMIN) {
      return payload.role;
    }

    return null;
  } catch {
    return null;
  }
};

type RefreshStatus = "idle" | "refreshing" | "success" | "failed";

const parseTokenExpiry = (token: string | null): number | null => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    return payload.exp ?? null;
  } catch {
    return null;
  }
};

interface AuthState {
  accessToken: string | null;
  userRole: UserRole | null;
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
    (set, get) => ({
      accessToken: null,
      userRole: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      refreshStatus: "idle",

      setAccessToken: (token) => {
        const expiresAt = parseTokenExpiry(token);
        authDebugLog("store.setAccessToken", {
          hasToken: !!token,
          expiresAt,
          currentTimeSec: Math.floor(Date.now() / 1000),
        });

        set({
          accessToken: token,
          userRole: parseUserRoleFromToken(token),
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          refreshStatus: "success",
        });
      },

      clearAccessToken: () => {
        authDebugLog("store.clearAccessToken", {
          wasAuthenticated: get().isAuthenticated,
          refreshStatus: get().refreshStatus,
        });

        set({
          accessToken: null,
          userRole: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          refreshStatus: "idle",
        });
      },

      setLoading: (loading) => {
        if (get().isLoading !== loading) {
          authDebugLog("store.setLoading", { previous: get().isLoading, next: loading });
        }

        set({ isLoading: loading });
      },

      setInitialized: (initialized) => {
        if (get().isInitialized !== initialized) {
          authDebugLog("store.setInitialized", { previous: get().isInitialized, next: initialized });
        }

        set({ isInitialized: initialized });
      },

      setRefreshStatus: (status) => {
        if (get().refreshStatus !== status) {
          authDebugLog("store.setRefreshStatus", { previous: get().refreshStatus, next: status });
        }

        set({ refreshStatus: status });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // hydration 완료 후 isInitialized를 true로 설정
        if (state) {
          authDebugLog("store.rehydrate.complete", {
            hasToken: !!state.accessToken,
            isAuthenticated: state.isAuthenticated,
          });
          state.userRole = parseUserRoleFromToken(state.accessToken);
          state.isInitialized = true;
        }
      },
    },
  ),
);

export default useAuthStore;
