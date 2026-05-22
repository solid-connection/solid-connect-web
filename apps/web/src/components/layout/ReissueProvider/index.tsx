"use client";

import type React from "react";
import { useEffect } from "react";

import { postReissueToken } from "@/apis/Auth";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { isTokenExpired } from "@/utils/jwtUtils";

interface ReissueProviderProps {
  children: React.ReactNode;
}

const ReissueProvider: React.FC<ReissueProviderProps> = ({ children }) => {
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const { accessToken, setInitialized, setLoading, setRefreshStatus, shouldAttemptRefresh } =
        useAuthStore.getState();

      if (accessToken && !isTokenExpired(accessToken)) {
        setInitialized(true);
        return;
      }

      if (!shouldAttemptRefresh) {
        setInitialized(true);
        return;
      }

      try {
        setRefreshStatus("refreshing");
        setLoading(true);

        // HttpOnly refresh token 쿠키가 있으면 access token을 복구합니다.
        await postReissueToken();
        if (isMounted) {
          useAuthStore.getState().setRefreshStatus("success");
        }
      } catch {
        if (isMounted) {
          useAuthStore.getState().clearAccessToken();
          useAuthStore.getState().setRefreshStatus("failed");
        }
      } finally {
        if (isMounted) {
          useAuthStore.getState().setLoading(false);
          useAuthStore.getState().setInitialized(true);
        }
      }
    };

    initializeAuth();

    // 컴포넌트 언마운트 시 플래그 설정
    return () => {
      isMounted = false;
    };
  }, []);

  return <>{children}</>;
};

export default ReissueProvider;
