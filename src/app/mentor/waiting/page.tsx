import { Metadata } from "next";

import WatingContent from "./_components/WatingContent";

export const metadata: Metadata = {
  title: "멘토 승인 대기 | Solid Connect",
  description: "멘토 신청이 접수되었습니다. 승인 결과를 기다려주세요.",
  keywords: ["멘토", "승인", "대기", "신청", "멘토링"],
};

const WatingPage = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <WatingContent />
    </div>
  );
};
export default WatingPage;
