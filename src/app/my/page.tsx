import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import MyContent from "./MyContent";

export const metadata: Metadata = {
  title: "마이페이지",
};

const MyPage = () => {
  return (
    <>
      <TopDetailNavigation title="마이페이지" />
      <MyContent />
    </>
  );
};

export default MyPage;
