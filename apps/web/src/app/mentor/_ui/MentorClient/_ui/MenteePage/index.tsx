"use client";

import MenteePageTabs from "../MenteePageTabs";
import MentorFindSection from "../MentorFindSection";

/**
 * 멘티 페이지 컴포넌트
 * - 나의 멘토 탭 (진행 중, 대기 중)
 * - 멘토 찾기 섹션
 */
const MenteePage = () => {
  return (
    <>
      {/* 탭 및 나의 멘토, 멘티요청 리스트 채팅카드 */}
      <MenteePageTabs />
      {/* 멘토찾기 섹션 */}
      <MentorFindSection />
    </>
  );
};

export default MenteePage;
