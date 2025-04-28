import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import ModifyContent from "./ModifyContent";

export const metadata: Metadata = {
  title: "프로필 수정",
};

const ModifyPage = () => {
  return (
    <>
      <TopDetailNavigation title="프로필 수정" />
      <ModifyContent />
    </>
  );
};

export default ModifyPage;
