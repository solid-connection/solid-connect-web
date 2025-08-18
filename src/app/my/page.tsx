import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import MyContent from "./MyContent";
import MyProfileContent from "./MyProfileContent";

export const metadata: Metadata = {
  title: "마이페이지",
};

const MyPage = () => {
  return (
    <>
      <TopDetailNavigation title="마이페이지" />
      <MyProfileContent />
    </>
  );
};

export default MyPage;
