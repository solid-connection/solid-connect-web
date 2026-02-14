import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types/mentor";

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
    (set) => ({
      accessToken: null,
      userRole: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      refreshStatus: "idle",

      setAccessToken: (token) => {
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
      onRehydrateStorage: () => (state) => {
        // hydration 완료 후 isInitialized를 true로 설정
        if (state) {
          state.userRole = parseUserRoleFromToken(state.accessToken);
          state.isInitialized = true;
        }
      },
    },
  ),
);

export default useAuthStore;
