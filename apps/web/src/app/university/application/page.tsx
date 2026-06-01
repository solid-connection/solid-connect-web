import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import ScorePageContent from "./ScorePageContent";

export const metadata: Metadata = {
  title: "점수 공유 현황",
  robots: NO_INDEX_ROBOTS,
};

const ScorePage = () => {
  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <div className="w-full">
        <ScorePageContent />
      </div>
    </>
  );
};

export default ScorePage;
