"use client";

import type React from "react";
import { useEffect } from "react";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { getValidAccessToken } from "@/utils/axiosInstance";
import { isTokenExpired } from "@/utils/jwtUtils";

interface ReissueProviderProps {
  children: React.ReactNode;
}

const ReissueProvider = ({ children }: ReissueProviderProps) => {
  useEffect(function initializeAuthentication() {
    const auth = useAuthStore.getState();
    if ((auth.accessToken && !isTokenExpired(auth.accessToken)) || !auth.shouldAttemptRefresh) {
      auth.setInitialized(true);
      return;
    }
    // The coordinator owns status and session checks for every refresh caller.
    void getValidAccessToken().catch(() => {});
  }, []);
  return <>{children}</>;
};

export default ReissueProvider;
