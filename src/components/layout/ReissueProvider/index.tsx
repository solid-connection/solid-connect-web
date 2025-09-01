"use client";

import React, { useEffect } from "react";

import { hasIsPrevLoginCookie } from "@/utils/authCookieUtils";

import postReissueToken from "@/api/auth/server/postReissueToken";
import useAuthStore from "@/lib/zustand/useAuthStore";

interface ReissueProviderProps {
  children: React.ReactNode;
}

const ReissueProvider: React.FC<ReissueProviderProps> = ({ children }) => {
  const { isInitialized, setLoading, clearAccessToken } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // 이미 초기화가 완료되었다면 실행하지 않음
      if (isInitialized) {
        return;
      }

      // isPrevLogin 쿠키가 없다면 토큰 재발급 API를 호출하지 않고 바로 종료
      if (!hasIsPrevLoginCookie()) {
        console.log("No isPrevLogin cookie found, user is not logged in");
        if (isMounted) {
          clearAccessToken();
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        // 토큰 재발급 시도 (HttpOnly 쿠키의 refresh token 사용)
        await postReissueToken();

        // reissueAccessToken이 성공하면 Zustand store에 토큰이 자동으로 설정됨
        console.log("Authentication initialized successfully");
      } catch (error) {
        // 토큰 재발급 실패 시 (로그인되지 않은 상태)
        console.log("No valid session found, user needs to login", error);

        // 컴포넌트가 아직 마운트되어 있을 때만 상태 업데이트
        if (isMounted) {
          clearAccessToken();
        }
      } finally {
        // 컴포넌트가 아직 마운트되어 있을 때만 로딩 상태 해제
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 컴포넌트 언마운트 시 플래그 설정
    return () => {
      isMounted = false;
    };
  }, [isInitialized, setLoading, clearAccessToken]);

  // 초기화 완료 후 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ReissueProvider;
