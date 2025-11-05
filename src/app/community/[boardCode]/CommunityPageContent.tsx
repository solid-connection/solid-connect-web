"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ButtonTab from "@/components/ui/ButtonTab";

import CommunityRegionSelector from "./CommunityRegionSelector";
import PostCards from "./PostCards";
import PostWriteButton from "./PostWriteButton";

import { COMMUNITY_BOARDS, COMMUNITY_CATEGORIES } from "@/constants/community";

import useGetPostList from "@/api/boards/clients/useGetPostList";

interface CommunityPageContentProps {
  boardCode: string;
}

const CommunityPageContent = ({ boardCode }: CommunityPageContentProps) => {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>("전체");

  // HydrationBoundary로부터 자동으로 prefetch된 데이터 사용
  const { data: posts = [] } = useGetPostList({
    boardCode,
    category,
  });

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
      {<PostCards posts={posts} boardCode={boardCode} />}
      <PostWriteButton onClick={postWriteHandler} />
    </div>
  );
};

export default CommunityPageContent;
