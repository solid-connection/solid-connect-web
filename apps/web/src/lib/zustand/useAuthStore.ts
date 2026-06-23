import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types/mentor";
import { isTokenExpired, tokenParse } from "@/utils/jwtUtils";

const parseUserRole = (role: string | undefined): UserRole | null => {
  if (role === UserRole.MENTOR || role === UserRole.MENTEE || role === UserRole.ADMIN) {
    return role;
  }

  return null;
};

const parseHomeUniversityId = (homeUniversity: string | undefined): number | null => {
  const homeUniversityId = Number(homeUniversity);

  return Number.isInteger(homeUniversityId) && homeUniversityId > 0 ? homeUniversityId : null;
};

type RefreshStatus = "idle" | "refreshing" | "success" | "failed";
type ClientRole = UserRole.MENTOR | UserRole.MENTEE;

const parseAuthToken = (token: string | null) => {
  if (!token || isTokenExpired(token)) {
    return {
      serverRole: null,
      homeUniversityId: null,
    };
  }

  const payload = tokenParse(token);

  return {
    serverRole: parseUserRole(payload?.role),
    homeUniversityId: parseHomeUniversityId(payload?.home_university),
  };
};

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
  homeUniversityId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  refreshStatus: RefreshStatus;
  shouldAttemptRefresh: boolean;
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
      homeUniversityId: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      refreshStatus: "idle",
      shouldAttemptRefresh: false,

      setAccessToken: (token) => {
        set((state) => {
          const { serverRole, homeUniversityId } = parseAuthToken(token);

          return {
            accessToken: token,
            serverRole,
            clientRole: resolveClientRole(serverRole, state.clientRole),
            homeUniversityId,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            refreshStatus: "success",
            shouldAttemptRefresh: true,
          };
        });
      },

      clearAccessToken: () => {
        set({
          accessToken: null,
          serverRole: null,
          clientRole: null,
          homeUniversityId: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          refreshStatus: "idle",
          shouldAttemptRefresh: false,
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
        shouldAttemptRefresh: state.shouldAttemptRefresh,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const hasValidToken = Boolean(state.accessToken && !isTokenExpired(state.accessToken));
          const hadStoredAuth = Boolean(state.shouldAttemptRefresh || state.isAuthenticated || state.accessToken);
          state.shouldAttemptRefresh = hadStoredAuth;

          if (!hasValidToken) {
            state.accessToken = null;
            state.serverRole = null;
            state.clientRole = null;
            state.homeUniversityId = null;
            state.isAuthenticated = false;
            // 저장된 로그인 흔적이 있으면 ReissueProvider가 refresh를 마칠 때까지 인증 분기를 보류합니다.
            state.isInitialized = !hadStoredAuth;
            state.isLoading = hadStoredAuth;
            state.refreshStatus = hadStoredAuth ? "refreshing" : "idle";
          } else {
            const { serverRole, homeUniversityId } = parseAuthToken(state.accessToken);
            state.serverRole = serverRole;
            state.clientRole = resolveClientRole(serverRole, state.clientRole);
            state.homeUniversityId = homeUniversityId;
            state.isAuthenticated = true;
            state.isInitialized = true;
            state.isLoading = false;
            state.refreshStatus = "success";
          }
        }
      },
    },
  ),
);

export default useAuthStore;
