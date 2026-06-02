import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import MatchContent from "./_ui/MatchContent";

export const metadata: Metadata = {
  title: "매칭 멘토",
  robots: NO_INDEX_ROBOTS,
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
