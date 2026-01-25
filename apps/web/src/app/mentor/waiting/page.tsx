import type { Metadata } from "next";

import WaitingContent from "./_ui/WaitingContent";

export const metadata: Metadata = {
  title: "멘토 승인 대기 | Solid Connect",
  description: "멘토 신청이 접수되었습니다. 승인 결과를 기다려주세요.",
  keywords: ["멘토", "승인", "대기", "신청", "멘토링"],
};

const WaitingPage = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <WaitingContent />
    </div>
  );
};
export default WaitingPage;
