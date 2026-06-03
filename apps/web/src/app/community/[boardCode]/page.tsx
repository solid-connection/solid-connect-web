import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import {
  COMMUNITY_INITIAL_CATEGORY,
  COMMUNITY_POST_LIST_GC_TIME,
  COMMUNITY_POST_LIST_STALE_TIME,
  communityPostListQueryKey,
  sortCommunityPosts,
} from "@/apis/community/postListQuery";
import { getPostListServer } from "@/apis/community/server";
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

const createCommunityPostListQueryClient = async (boardCode: string) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: communityPostListQueryKey(boardCode, COMMUNITY_INITIAL_CATEGORY),
    queryFn: async () => {
      const result = await getPostListServer({
        boardCode,
        category: COMMUNITY_INITIAL_CATEGORY,
      });

      if (!result.ok) {
        throw new Error(`Failed to fetch community posts: ${result.status}`);
      }

      return sortCommunityPosts(result.data);
    },
    staleTime: COMMUNITY_POST_LIST_STALE_TIME,
    gcTime: COMMUNITY_POST_LIST_GC_TIME,
  });

  return queryClient;
};

const CommunityPage = async ({ params }: CommunityPageProps) => {
  const { boardCode } = await params;
  const queryClient = await createCommunityPostListQueryClient(boardCode);

  return (
    <div className="w-full">
      <TopDetailNavigation title="커뮤니티" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommunityPageContent boardCode={boardCode} />
      </HydrationBoundary>
    </div>
  );
};

export default CommunityPage;
