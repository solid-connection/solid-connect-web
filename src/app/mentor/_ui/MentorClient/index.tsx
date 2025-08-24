"use client";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import MenteePageTabs from "./_ui/MenteePageTabs";
import MentorFindSection from "./_ui/MentorFindSection";
import MentorPage from "./_ui/MentorPage";

import useRouterHandler from "@/lib/hooks/useJWTParseRouteHandler";

const MentorClient = () => {
  const { isLoaded, isMentor } = useRouterHandler();
  return (
    <>
      {isLoaded ? (
        <CloudSpinnerPage />
      ) : isMentor ? (
        // 멘토페이지
        <>
          <MentorPage />
        </>
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
