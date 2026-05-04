import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types/mentor";
import { isTokenExpired } from "@/utils/jwtUtils";

const parseUserRoleFromToken = (token: string | null): UserRole | null => {
  if (!token || isTokenExpired(token)) return null;

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
type ClientRole = UserRole.MENTOR | UserRole.MENTEE;

const resolveClientRole = (serverRole: UserRole | null, currentClientRole: ClientRole | null): ClientRole | null => {
  if (serverRole === UserRole.ADMIN) {
    return currentClientRole ?? UserRole.MENTOR;
  }

  if (serverRole === UserRole.MENTOR || serverRole === UserRole.MENTEE) {
    return serverRole;
  }

  return null;
};

interface AuthState {
  accessToken: string | null;
  serverRole: UserRole | null;
  clientRole: ClientRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  refreshStatus: RefreshStatus;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setClientRole: (role: ClientRole) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setRefreshStatus: (status: RefreshStatus) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      serverRole: null,
      clientRole: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      refreshStatus: "idle",

      setAccessToken: (token) => {
        set((state) => {
          const serverRole = parseUserRoleFromToken(token);

          return {
            accessToken: token,
            serverRole,
            clientRole: resolveClientRole(serverRole, state.clientRole),
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            refreshStatus: "success",
          };
        });
      },

      clearAccessToken: () => {
        set({
          accessToken: null,
          serverRole: null,
          clientRole: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          refreshStatus: "idle",
        });
      },

      setClientRole: (role) => {
        set((state) => {
          if (state.serverRole !== UserRole.ADMIN) {
            return {};
          }

          return { clientRole: role };
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
        clientRole: state.clientRole,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // hydration 완료 후 isInitialized를 true로 설정
        if (state) {
          const hasValidToken = Boolean(state.accessToken && !isTokenExpired(state.accessToken));

          if (!hasValidToken) {
            state.accessToken = null;
            state.serverRole = null;
            state.clientRole = null;
            state.isAuthenticated = false;
            state.refreshStatus = "idle";
          } else {
            const serverRole = parseUserRoleFromToken(state.accessToken);
            state.serverRole = serverRole;
            state.clientRole = resolveClientRole(serverRole, state.clientRole);
            state.isAuthenticated = true;
            state.refreshStatus = "success";
          }

          state.isInitialized = true;
        }
      },
    },
  ),
);

export default useAuthStore;
