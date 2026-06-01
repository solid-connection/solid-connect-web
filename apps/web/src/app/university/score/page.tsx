import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";
import ScoreScreen from "./ScoreScreen";

export const metadata: Metadata = {
  title: "성적 확인하기",
  robots: NO_INDEX_ROBOTS,
};

const ScorePage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 확인하기" />
      <div className="w-full px-5">
        <ScoreScreen />
      </div>
    </>
  );
};

export default ScorePage;
