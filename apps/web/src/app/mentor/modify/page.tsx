import type { Metadata } from "next";

import ModifyContent from "./_ui/ModifyContent";

export const metadata: Metadata = {
  title: "멘토 정보 수정 | Solid Connect",
  description: "멘토 프로필과 정보를 수정하여 더 나은 멘토링을 제공하세요.",
  keywords: ["멘토", "정보수정", "프로필", "멘토링", "설정"],
};

const ModifyPage = () => {
  return <div className="w-full px-5">{<ModifyContent />}</div>;
};

export default ModifyPage;
