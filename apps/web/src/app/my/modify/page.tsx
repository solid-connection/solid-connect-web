import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import ModifyContent from "./_ui/ModifyContent";

export const metadata: Metadata = {
  title: "프로필 수정",
};

const ModifyPage = () => {
  return (
    <>
      <TopDetailNavigation title="프로필 수정" />
      <div className="w-full px-5">
        <ModifyContent />
      </div>
    </>
  );
};

export default ModifyPage;
