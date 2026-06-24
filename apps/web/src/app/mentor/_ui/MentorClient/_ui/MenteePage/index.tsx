"use client";

import MenteePageTabs from "../MenteePageTabs";
import MentorFindSection from "../MentorFindSection";

/**
 * 멘티 페이지 컴포넌트
 * - 나의 멘토 탭 (진행 중, 대기 중)
 * - 멘토 찾기 섹션
 */
const MenteePage = ({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) => {
  if (variant === "desktop") {
    return (
      <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
        <header className="mb-8">
          <p className="text-primary typo-sb-9">Mentor</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">멘토링</h1>
          <p className="mt-2 max-w-2xl text-k-500 typo-medium-2">
            진행 중인 멘토링을 확인하고, 교환학생 경험을 나눠줄 멘토를 찾아보세요.
          </p>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(360px,440px)_minmax(0,1fr)]">
          <MenteePageTabs variant="desktop" />
          <MentorFindSection variant="desktop" />
        </div>
      </div>
    );
  }

  return (
    <>
      <MenteePageTabs />
      <MentorFindSection />
    </>
  );
};

export default MenteePage;
