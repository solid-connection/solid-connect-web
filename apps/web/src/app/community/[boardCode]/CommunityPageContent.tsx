"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetPostList } from "@/apis/community";
import ButtonTab from "@/components/ui/ButtonTab";
import { COMMUNITY_BOARDS, COMMUNITY_CATEGORIES } from "@/constants/community";
import useReportedPostsStore from "@/lib/zustand/useReportedPostsStore";
import type { ListPost } from "@/types/community";
import CommunityRegionSelector from "./CommunityRegionSelector";
import PostCards from "./PostCards";
import PostWriteButton from "./PostWriteButton";

type ListPostWithAuthor = ListPost & {
  postFindSiteUserResponse?: {
    id: number;
  };
};

interface CommunityPageContentProps {
  boardCode: string;
}

const CommunityPageContent = ({ boardCode }: CommunityPageContentProps) => {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>("전체");
  const reportedPostIds = useReportedPostsStore((state) => state.reportedPostIds);
  const blockedUserIds = useReportedPostsStore((state) => state.blockedUserIds);

  const { data: posts = [] } = useGetPostList({
    boardCode,
    category,
  });

  const visiblePosts = useMemo(() => {
    if (reportedPostIds.length === 0 && blockedUserIds.length === 0) {
      return posts;
    }

    const reportedIdSet = new Set(reportedPostIds);
    const blockedUserIdSet = new Set(blockedUserIds);

    return posts.filter((post) => {
      if (reportedIdSet.has(post.id)) {
        return false;
      }

      const authorId = (post as ListPostWithAuthor).postFindSiteUserResponse?.id;

      if (typeof authorId === "number" && blockedUserIdSet.has(authorId)) {
        return false;
      }

      return true;
    });
  }, [posts, reportedPostIds, blockedUserIds]);

  const handleBoardChange = (newBoard: string) => {
    router.push(`/community/${newBoard}`);
  };

  const postWriteHandler = () => {
    router.push(`/community/${boardCode}/create`);
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
      {<PostCards posts={visiblePosts} boardCode={boardCode} />}
      <PostWriteButton onClick={postWriteHandler} />
    </div>
  );
};

export default CommunityPageContent;
