import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import ScorePageContent from "./ScorePageContent";

export const metadata: Metadata = {
  title: "점수 공유 현황",
};

const ScorePage = () => {
  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <ScorePageContent />
    </>
  );
};

export default ScorePage;
