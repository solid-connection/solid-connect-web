import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import MyProfileContent from "./_ui/MyProfileContent";

export const metadata: Metadata = {
  title: "마이페이지",
};

const MyPage = () => {
  return (
    <>
      <TopDetailNavigation title="마이페이지" />
      <div className="w-full px-5">
        <MyProfileContent />
      </div>
    </>
  );
};

export default MyPage;
