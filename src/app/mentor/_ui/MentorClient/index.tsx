"use client";

import { useState } from "react";

import { tokenParse } from "@/utils/jwtUtils";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import MenteePageTabs from "./_ui/MenteePageTabs";
import MentorFindSection from "./_ui/MentorFindSection";
import MentorPage from "./_ui/MentorPage";

import { UserRole } from "@/types/mentor";

import useAuthStore from "@/lib/zustand/useAuthStore";

const MentorClient = () => {
  const { isLoading, accessToken } = useAuthStore();
  const parsedToken = tokenParse(accessToken);
  const userRole = parsedToken?.role;
  const isMentor = userRole === UserRole.MENTOR || userRole === UserRole.ADMIN;
  const isAdmin = userRole === UserRole.ADMIN;

  // 어드민 전용: 뷰 전환 상태 (true: 멘토 뷰, false: 멘티 뷰)
  const [showMentorView, setShowMentorView] = useState<boolean>(true);

  if (isLoading || !accessToken) return <CloudSpinnerPage />; // 로딩 중일 때 스피너 표시

  // 어드민이 아닌 경우 기존 로직대로
  const shouldShowMentorView = isAdmin ? showMentorView : isMentor;

  return (
    <>
      {/* 어드민 전용 뷰 전환 버튼 */}
      {isAdmin && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowMentorView(true)}
            className={`flex-1 rounded-lg px-4 py-2.5 typo-sb-9 transition-colors ${
              showMentorView ? "bg-primary text-white" : "border border-k-200 bg-white text-k-600 hover:bg-k-50"
            }`}
          >
            멘토 페이지 보기
          </button>
          <button
            onClick={() => setShowMentorView(false)}
            className={`flex-1 rounded-lg px-4 py-2.5 typo-sb-9 transition-colors ${
              !showMentorView ? "bg-primary text-white" : "border border-k-200 bg-white text-k-600 hover:bg-k-50"
            }`}
          >
            멘티 페이지 보기
          </button>
        </div>
      )}

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
    </>
  );
};

export default MentorClient;
