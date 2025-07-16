import { Metadata } from "next";

import MentorDetialContent from "./_components/MentorDetialContent";

export const metadata: Metadata = {
  title: "멘토 상세 정보 | Solid Connect",
  description: "멘토의 상세 정보와 경험, 아티클을 확인하고 멘토링을 신청해보세요.",
  keywords: ["멘토", "멘토링", "유학", "상세정보", "교환학생"],
};

const MentoDetailPage = () => {
  return (
    <div className="flex w-full flex-col px-5">
      <MentorDetialContent />
    </div>
  );
};

export default MentoDetailPage;
