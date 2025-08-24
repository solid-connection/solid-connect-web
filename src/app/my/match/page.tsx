import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import MatchContent from "./_ui/MatchContent";

export const metadata: Metadata = {
  title: "프로필 수정",
};

const MatchPage = () => {
  return (
    <>
      <TopDetailNavigation title="프로필 수정" />
      <MatchContent />
    </>
  );
};

export default MatchPage;
