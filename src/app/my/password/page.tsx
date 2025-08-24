import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import PasswordContent from "./_ui/PasswordContent";

export const metadata: Metadata = {
  title: "비밀번호 수정",
};

const ModifyPage = () => {
  return (
    <>
      <TopDetailNavigation title="비밀번호 수정" />
      <PasswordContent />
    </>
  );
};

export default ModifyPage;
