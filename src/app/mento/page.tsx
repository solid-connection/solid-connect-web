import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import MentorDashBoard from "./MentorDashBoard";

export const metadata: Metadata = {
  title: "멘토",
  description: "멘토 페이지",
};

const MentorPage = () => {
  return (
    <>
      <TopDetailNavigation title="멘토" />
      <MentorDashBoard />
    </>
  );
};

export default MentorPage;
