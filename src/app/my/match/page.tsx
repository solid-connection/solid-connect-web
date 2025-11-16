import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import MatchContent from "./_ui/MatchContent";

export const metadata: Metadata = {
  title: "프로필 수정",
};

const MatchPage = () => {
  return (
    <>
      <TopDetailNavigation title="매칭 멘토" />
      <div className="w-full px-5">
        <MatchContent />
      </div>
    </>
  );
};

export default MatchPage;
