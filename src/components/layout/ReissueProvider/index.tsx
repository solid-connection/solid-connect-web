"use client";

import React, { useEffect } from "react";

import postReissueToken from "@/api/auth/server/postReissueToken";
import useAuthStore from "@/lib/zustand/useAuthStore";

interface ReissueProviderProps {
  children: React.ReactNode;
}

const ReissueProvider: React.FC<ReissueProviderProps> = ({ children }) => {
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { isInitialized, setLoading, clearAccessToken } = useAuthStore.getState();

        // 이미 초기화가 완료되었다면 실행하지 않음
        if (isInitialized) {
          return;
        }

        if (isMounted) {
          clearAccessToken();
          setLoading(false);
        }

        try {
          setLoading(true);

          // 토큰 재발급 시도 (HttpOnly 쿠키의 refresh token 사용)
          await postReissueToken();

          // reissueAccessToken이 성공하면 Zustand store에 토큰이 자동으로 설정됨
        } catch (error) {
          // 토큰 재발급 실패 시 (로그인되지 않은 상태)

          // 컴포넌트가 아직 마운트되어 있을 때만 상태 업데이트
          if (isMounted) {
            useAuthStore.getState().clearAccessToken();
          }
        } finally {
          // 컴포넌트가 아직 마운트되어 있을 때만 로딩 상태 해제
          if (isMounted) {
            useAuthStore.getState().setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();

    // 컴포넌트 언마운트 시 플래그 설정
    return () => {
      isMounted = false;
    };
  }, []); // 의존성 배열을 빈 배열로 변경

  // 초기화 완료 후 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ReissueProvider;
