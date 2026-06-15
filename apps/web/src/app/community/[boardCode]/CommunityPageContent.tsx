"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetPostList } from "@/apis/community";
import { COMMUNITY_INITIAL_CATEGORY } from "@/apis/community/postListQuery";
import ButtonTab from "@/components/ui/ButtonTab";
import { COMMUNITY_BOARDS, COMMUNITY_CATEGORIES } from "@/constants/community";
import useAuthStore from "@/lib/zustand/useAuthStore";
import useReportedPostsStore from "@/lib/zustand/useReportedPostsStore";
import { buildLoginPathWithRedirect } from "@/utils/authRedirect";
import { CommunityPostListSkeleton } from "./CommunityPageSkeleton";
import CommunityRegionSelector from "./CommunityRegionSelector";
import PostCards from "./PostCards";
import PostWriteButton from "./PostWriteButton";

interface CommunityPageContentProps {
  boardCode: string;
}

const CommunityPageContent = ({ boardCode }: CommunityPageContentProps) => {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(COMMUNITY_INITIAL_CATEGORY);
  const reportedPostIds = useReportedPostsStore((state) => state.reportedPostIds);
  const blockedUserIds = useReportedPostsStore((state) => state.blockedUserIds);
  const blockedPostIds = useReportedPostsStore((state) => state.blockedPostIds);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const refreshStatus = useAuthStore((state) => state.refreshStatus);

  const { data: posts = [], isPending } = useGetPostList({
    boardCode,
    category,
  });

  const visiblePosts = useMemo(() => {
    if (reportedPostIds.length === 0 && blockedUserIds.length === 0 && blockedPostIds.length === 0) {
      return posts;
    }

    const reportedIdSet = new Set(reportedPostIds);
    const blockedUserIdSet = new Set(blockedUserIds);
    const blockedPostIdSet = new Set(blockedPostIds);

    return posts.filter((post) => {
      if (reportedIdSet.has(post.id) || blockedPostIdSet.has(post.id)) {
        return false;
      }

      const authorId = post.postFindSiteUserResponse?.id;

      if (typeof authorId === "number" && blockedUserIdSet.has(authorId)) {
        return false;
      }

      return true;
    });
  }, [posts, reportedPostIds, blockedUserIds, blockedPostIds]);

  const handleBoardChange = (newBoard: string) => {
    router.push(`/community/${newBoard}`);
  };

  const postWriteHandler = () => {
    const createPath = `/community/${boardCode}/create`;

    if (!isInitialized || refreshStatus === "refreshing") {
      return;
    }

    const nextPath = isAuthenticated && accessToken ? createPath : buildLoginPathWithRedirect(createPath);

    router.push(nextPath);
  };

  const getBoardNameKo = (code: string) => {
    return COMMUNITY_BOARDS.find((board) => board.code === code)?.nameKo ?? "";
  };
  const boardName = getBoardNameKo(boardCode);

  return (
    <div>
      <CommunityRegionSelector
        curRegion={boardName}
        setCurRegion={handleBoardChange}
        regionChoices={COMMUNITY_BOARDS}
      />
      <ButtonTab
        choices={COMMUNITY_CATEGORIES}
        choice={category}
        setChoice={setCategory}
        style={{ padding: "10px 0 10px 18px" }}
      />
      {isPending ? <CommunityPostListSkeleton /> : <PostCards posts={visiblePosts} boardCode={boardCode} />}
      <PostWriteButton onClick={postWriteHandler} />
    </div>
  );
};

export default CommunityPageContent;
