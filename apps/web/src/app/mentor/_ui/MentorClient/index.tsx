"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { postReissueToken } from "@/apis/Auth";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { UserRole } from "@/types/mentor";
import { isTokenExpired } from "@/utils/jwtUtils";
import MenteePage from "./_ui/MenteePage";
import MentorPage from "./_ui/MentorPage";

const MentorClient = () => {
  const router = useRouter();
  const { isLoading, accessToken, clientRole, isInitialized, refreshStatus, setRefreshStatus } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasValidAccessToken = Boolean(accessToken && !isTokenExpired(accessToken));

  // 토큰 재발급 로직
  useEffect(() => {
    const attemptTokenRefresh = async () => {
      // 이미 실패한 경우 재시도하지 않음 (무한 루프 방지)
      if (refreshStatus === "failed") {
        return;
      }

      // 초기화 이후 유효한 access token이 없을 때만 재발급 시도
      if (!isInitialized || hasValidAccessToken || isRefreshing || refreshStatus === "refreshing") {
        return;
      }

      setIsRefreshing(true);
      setRefreshStatus("refreshing");

      try {
        await postReissueToken();
        setRefreshStatus("success");
      } catch {
        // 재발급 실패 시 로그인 페이지로 리다이렉트
        setRefreshStatus("failed");
        router.push("/login");
      } finally {
        setIsRefreshing(false);
      }
    };

    attemptTokenRefresh();
  }, [isInitialized, hasValidAccessToken, isRefreshing, refreshStatus, setRefreshStatus, router]);

  // 초기화 전이거나 로딩 중이거나 재발급 중일 때 스피너 표시
  if (!isInitialized || isLoading || refreshStatus === "refreshing" || isRefreshing) {
    return <CloudSpinnerPage />;
  }

  // 초기화 완료 후에도 토큰이 없으면 리다이렉트 (useEffect에서 처리되지만 fallback)
  if (!hasValidAccessToken) {
    return <CloudSpinnerPage />;
  }

  if (!clientRole) {
    return <CloudSpinnerPage />;
  }

  return clientRole === UserRole.MENTOR ? <MentorPage /> : <MenteePage />;
};

export default MentorClient;
