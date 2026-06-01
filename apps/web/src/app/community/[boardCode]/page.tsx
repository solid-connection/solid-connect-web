import type { Metadata } from "next";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { COMMUNITY_BOARDS } from "@/constants/community";
import { NO_INDEX_ROBOTS } from "@/utils/seo";
import CommunityPageContent from "./CommunityPageContent";

interface CommunityPageProps {
  params: Promise<{
    boardCode: string;
  }>;
}

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { boardCode } = await params;
  const board = COMMUNITY_BOARDS.find((item) => item.code === boardCode);

  if (!board) {
    return {
      title: "커뮤니티",
      robots: NO_INDEX_ROBOTS,
    };
  }

  return {
    title: `${board.nameKo} 교환학생 커뮤니티 | 솔리드커넥션`,
    description: `${board.nameKo} 교환학생 준비, 파견 생활, 학교 정보와 질문을 나누는 솔리드커넥션 커뮤니티입니다.`,
    robots: NO_INDEX_ROBOTS,
  };
}

const CommunityPage = async ({ params }: CommunityPageProps) => {
  const { boardCode } = await params;

  return (
    <div className="w-full">
      <TopDetailNavigation title="커뮤니티" />
      <CommunityPageContent boardCode={boardCode} />
    </div>
  );
};

export default CommunityPage;
