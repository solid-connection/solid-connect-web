import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import PasswordContent from "./_ui/PasswordContent";

export const metadata: Metadata = {
  title: "비밀번호 수정",
  robots: NO_INDEX_ROBOTS,
};

const ModifyPage = () => {
  return (
    <>
      <TopDetailNavigation title="비밀번호 수정" />
      <div className="w-full px-5 md:px-0">
        <PasswordContent />
      </div>
    </>
  );
};

export default ModifyPage;
