"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ButtonTab from "@/components/ui/ButtonTab";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

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
  const [category, setCategory] = useState<string>("전체");

  const { data: posts = [] } = useGetPostList({ boardCode });

  const handleBoardChange = (newBoard: string) => {
    router.push(`/community/${newBoard}`);
  };

  const postWriteHandler = () => {
    router.push(`/community/${boardCode}/create`);
  };

  return (
    <div>
      <CommunityRegionSelector curRegion={"전체"} setCurRegion={handleBoardChange} regionChoices={COMMUNITY_BOARDS} />
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
