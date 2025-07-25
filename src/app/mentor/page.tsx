import { Metadata } from "next";

import MentorClient from "./_ui/MentorClient";

export const metadata: Metadata = {
  title: "멘토 찾기 | Solid Connect",
  description: "다양한 분야의 전문 멘토들을 만나보세요. 유학, 취업, 진로 상담을 받을 수 있습니다.",
  keywords: ["멘토", "멘토링", "유학", "취업", "진로상담", "전문가"],
};

const MentorPage = () => {
  return (
    <div className="px-5">
      <MentorClient />
    </div>
  );
};

export default MentorPage;
