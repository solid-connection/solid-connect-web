import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import ModifyContent from "./_ui/ModifyContent";

export const metadata: Metadata = {
  title: "프로필 수정",
  robots: NO_INDEX_ROBOTS,
};

const ModifyPage = () => {
  return (
    <>
      <TopDetailNavigation title="프로필 수정" />
      <div className="w-full px-5 md:px-0">
        <ModifyContent />
      </div>
    </>
  );
};

export default ModifyPage;
