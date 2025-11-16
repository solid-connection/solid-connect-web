import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import CommunityPageContent from "./CommunityPageContent";

import { COMMUNITY_BOARDS } from "@/constants/community";

import { QueryKeys } from "@/api/boards/clients/QueryKeys";
import { getPostList } from "@/api/boards/server/getPostList";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "커뮤니티",
};

// ISR: 정적 경로 생성
export async function generateStaticParams() {
  return COMMUNITY_BOARDS.map((board) => ({
    boardCode: board.code,
  }));
}

// ISR: 자동 재생성 비활성화 (수동 revalidate만 사용)
export const revalidate = false;

interface CommunityPageProps {
  params: {
    boardCode: string;
  };
}

const CommunityPage = async ({ params }: CommunityPageProps) => {
  const { boardCode } = params;

  // QueryClient 생성 (서버 컴포넌트에서만 사용)
  const queryClient = new QueryClient();

  // 기본 카테고리
  const defaultCategory = "전체";

  // 서버에서 데이터 prefetch (ISR - 수동 revalidate만)
  const result = await getPostList({ boardCode, category: defaultCategory, revalidate: false });

  if (result.ok) {
    // React Query 캐시에 데이터 설정 (서버 fetch와 동일한 category 사용)
    queryClient.setQueryData([QueryKeys.postList, boardCode, defaultCategory], {
      data: result.data,
    });
  }

  return (
    <div className="w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TopDetailNavigation title="커뮤니티" />
        <CommunityPageContent boardCode={boardCode} />
      </HydrationBoundary>
    </div>
  );
};

export default CommunityPage;
