"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postReissueToken } from "@/apis/Auth";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { UserRole } from "@/types/mentor";
import { tokenParse } from "@/utils/jwtUtils";

// 레이지 로드 컴포넌트
const MenteePageTabs = lazy(() => import("./_ui/MenteePageTabs"));
const MentorFindSection = lazy(() => import("./_ui/MentorFindSection"));
const MentorPage = lazy(() => import("./_ui/MentorPage"));

const MentorClient = () => {
  const router = useRouter();
  const { isLoading, accessToken, isInitialized, refreshStatus, setRefreshStatus } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 어드민 전용: 뷰 전환 상태 (true: 멘토 뷰, false: 멘티 뷰)
  const [showMentorView, setShowMentorView] = useState<boolean>(true);

  // 토큰 재발급 로직
  useEffect(() => {
    const attemptTokenRefresh = async () => {
      // 이미 초기화되었고 토큰이 없는 경우에만 재발급 시도
      if (!isInitialized || accessToken || isRefreshing || refreshStatus === "refreshing") {
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
        router.push("/login?redirect=/mentor");
      } finally {
        setIsRefreshing(false);
      }
    };

    attemptTokenRefresh();
  }, [isInitialized, accessToken, isRefreshing, refreshStatus, setRefreshStatus, router]);

  // 초기화 전이거나 로딩 중이거나 재발급 중일 때 스피너 표시
  if (!isInitialized || isLoading || refreshStatus === "refreshing" || isRefreshing) {
    return <CloudSpinnerPage />;
  }

  // 초기화 완료 후에도 토큰이 없으면 리다이렉트 (useEffect에서 처리되지만 fallback)
  if (!accessToken) {
    return <CloudSpinnerPage />;
  }

  const parsedToken = tokenParse(accessToken);
  const userRole = parsedToken?.role;
  const isMentor = userRole === UserRole.MENTOR || userRole === UserRole.ADMIN;
  const isAdmin = userRole === UserRole.ADMIN;

  // 어드민이 아닌 경우 기존 로직대로
  const shouldShowMentorView = isAdmin ? showMentorView : isMentor;

  return (
    <>
      {/* 어드민 전용 뷰 전환 버튼 */}
      {isAdmin && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowMentorView(true)}
            className={`flex-1 rounded-lg px-4 py-2.5 transition-colors typo-sb-9 ${
              showMentorView ? "bg-primary text-white" : "border border-k-200 bg-white text-k-600 hover:bg-k-50"
            }`}
          >
            멘토 페이지 보기
          </button>
          <button
            onClick={() => setShowMentorView(false)}
            className={`flex-1 rounded-lg px-4 py-2.5 transition-colors typo-sb-9 ${
              !showMentorView ? "bg-primary text-white" : "border border-k-200 bg-white text-k-600 hover:bg-k-50"
            }`}
          >
            멘티 페이지 보기
          </button>
        </div>
      )}

      <Suspense fallback={<CloudSpinnerPage />}>
        {shouldShowMentorView ? (
          // 멘토페이지
          <MentorPage />
        ) : (
          // 멘티페이지
          <>
            {/* 탭 및 나의 멘토 , 멘티요청 리스트 채팅카드 */}
            <MenteePageTabs />
            {/* 멘토찾기 섹션 */}
            <MentorFindSection />
          </>
        )}
      </Suspense>
    </>
  );
};

export default MentorClient;
