import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import CommunityPageContent from "./CommunityPageContent";

import { getPostList } from "@/api/boards/server/getPostList";
import { COMMUNITY_BOARDS } from "@/constants/community";

export const metadata: Metadata = {
  title: "커뮤니티",
};

// ISR: 정적 경로 생성
export async function generateStaticParams() {
  return COMMUNITY_BOARDS.map((board) => ({
    boardCode: board.code,
  }));
}

// ISR: 60초마다 재생성
export const revalidate = 60;

interface CommunityPageProps {
  params: {
    boardCode: string;
  };
}

const CommunityPage = async ({ params }: CommunityPageProps) => {
  const { boardCode } = params;

  // 서버에서 초기 데이터 fetch (ISR)
  const result = await getPostList({ boardCode, revalidate: 60 });
  const initialPosts = result.ok ? result.data : [];

  return (
    <>
      <TopDetailNavigation title="커뮤니티" />
      <CommunityPageContent boardCode={boardCode} initialPosts={initialPosts} />
    </>
  );
};

export default CommunityPage;
