"use client";

// Next.js 13+ App Router 환경을 위한 클라이언트 컴포넌트 명시
import { useEffect } from "react";

import postReissueToken from "@/api/auth/server/postReissueToken";
import useAuthStore from "@/lib/zustand/useAuthStore";

/**
 * 앱이 처음 로드될 때 자동 로그인을 처리하는 Provider 컴포넌트.
 * 이 컴포넌트는 _app.tsx 또는 최상위 Layout에서 모든 페이지를 감싸야 합니다.
 */
interface ReissueProviderProps {
  children: React.ReactNode;
}

const ReissueProvider = ({ children }: ReissueProviderProps) => {
  const { setLoading, clearAccessToken } = useAuthStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // HttpOnly 쿠키에 있는 리프레시 토큰을 기반으로 액세스 토큰 재발급 시도
        // reissueAccessToken 함수가 성공 시 내부적으로 Zustand 스토어에 토큰을 저장합니다.
        await postReissueToken();
      } catch (error) {
        // 재발급 실패는 로그인이 되어있지 않거나 세션이 만료된 경우이므로,
        // 인증 상태를 깨끗하게 비워줍니다.
        console.error("Initial token reissue failed, user is not logged in.", error);
        clearAccessToken();
      } finally {
        // 성공하든 실패하든, 인증 확인 절차는 끝났으므로 로딩 상태를 해제합니다.
        setLoading(false);
      }
    };

    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열을 전달하여 최초 렌더링 시에만 실행되도록 함

  // 인증 확인이 끝나면 실제 앱 콘텐츠를 렌더링
  return <>{children}</>;
};

export default ReissueProvider;
