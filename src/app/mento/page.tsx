import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import MenteeMentoringTabs from "@/components/mentor/MenteeMentoringTabs";
import MentoFindSection from "@/components/mentor/MentoFindSection";

import MentorDashBoard from "./MentorDashBoard";

export const metadata: Metadata = {
  title: "멘토",
  description: "멘토 페이지",
};

const MentorPage = () => {
  const isMentor = false; // This can be determined based on user role or context
  return (
    <>
      <TopDetailNavigation title="멘토" />
      {isMentor ? (
        <MentorDashBoard />
      ) : (
        <div className="min-h-screen px-4">
          <MenteeMentoringTabs />
          <div className="mb-10 mt-10 h-1.5 w-full bg-k-50"></div>
          {/* 멘토찾기 섹션 */}
          <MentoFindSection />
        </div>
      )}
    </>
  );
};

export default MentorPage;
