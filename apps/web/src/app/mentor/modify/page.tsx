import type { Metadata } from "next";

import { NO_INDEX_ROBOTS } from "@/utils/seo";
import ModifyContent from "./_ui/ModifyContent";

export const metadata: Metadata = {
  title: "멘토 정보 수정 | 솔리드커넥션",
  description: "멘토 프로필과 정보를 수정하여 더 나은 멘토링을 제공하세요.",
  robots: NO_INDEX_ROBOTS,
};

const ModifyPage = () => {
  return <div className="w-full px-5 md:px-0">{<ModifyContent />}</div>;
};

export default ModifyPage;
