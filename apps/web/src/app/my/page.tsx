import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import MyProfileContent from "./_ui/MyProfileContent";

export const metadata: Metadata = {
  title: "마이페이지",
  robots: NO_INDEX_ROBOTS,
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
