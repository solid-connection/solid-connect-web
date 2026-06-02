import type { Metadata } from "next";

import { NO_INDEX_ROBOTS } from "@/utils/seo";
import MentorDetialContent from "./_ui/MentorDetialContent";

export const metadata: Metadata = {
  title: "멘토 상세 정보 | 솔리드커넥션",
  description: "멘토의 상세 정보와 경험, 아티클을 확인하고 멘토링을 신청해보세요.",
  robots: NO_INDEX_ROBOTS,
};

interface MentorDetailPageProps {
  params: Promise<{ id: string }>;
}

const MentorDetailPage = async ({ params }: MentorDetailPageProps) => {
  const { id } = await params;
  const mentorId = Number(id);

  return (
    <div className="flex w-full flex-col px-5">
      <MentorDetialContent mentorId={mentorId} />
    </div>
  );
};

export default MentorDetailPage;
