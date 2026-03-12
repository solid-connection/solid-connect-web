import type { Metadata } from "next";
import dynamic from "next/dynamic";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

const ScoreScreen = dynamic(() => import("./ScoreScreen"), { ssr: false });

export const metadata: Metadata = {
  title: "성적 확인하기",
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
