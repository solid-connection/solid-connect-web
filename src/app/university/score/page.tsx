import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import ScoreScreen from "./ScoreScreen";

export const metadata: Metadata = {
  title: "성적 확인하기",
};

const ScorePage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 확인하기" />
      <ScoreScreen />
    </>
  );
};

export default ScorePage;
