"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getPostListApi } from "@/services/community";

import CloudSpinnerPage from "@/components/loading/CloudSpinnerPage";
import ButtonTab from "@/components/ui/ButtonTab";

import CommunityRegionSelector from "./CommunityRegionSelector";
import PostCards from "./PostCards";
import PostWriteButton from "./PostWriteButton";

import { COMMUNITY_BOARDS, COMMUNITY_CATEGORIES } from "@/constants/commnunity";
import { ListPost } from "@/types/community";

interface CommunityPageContentProps {
  boardCode: string;
}

const CommunityPageContent = ({ boardCode }: CommunityPageContentProps) => {
  const router = useRouter();
  const [boardDisplayName, setBoardDisplayName] = useState<string>("자유");
  const [category, setCategory] = useState<string>("전체");
  const [posts, setPosts] = useState<ListPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await getPostListApi(boardCode, category);
        setPosts(res.data.reverse());
      } catch (err) {
        if (err.response) {
          console.error("Axios response error", err.response);
          if (err.response.status === 401 || err.response.status === 403) {
            alert("로그인이 필요합니다");
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
    setBoardDisplayName(COMMUNITY_BOARDS.find((b) => b.code === boardCode)?.nameKo || "자유");
  }, [boardCode, category]);

  const handleBoardChange = (newBoard: string) => {
    router.push(`/community/${newBoard}`);
  };

  const postWriteHandler = () => {
    router.push(`/community/${boardCode}/create`);
  };

  return (
    <div>
      <CommunityRegionSelector
        curRegion={boardDisplayName}
        setCurRegion={handleBoardChange}
        regionChoices={COMMUNITY_BOARDS}
      />
      <ButtonTab
        choices={COMMUNITY_CATEGORIES}
        choice={category}
        setChoice={setCategory}
        style={{ padding: "10px 0 10px 18px" }}
      />
      {isLoading ? <CloudSpinnerPage /> : <PostCards posts={posts} boardCode={boardCode} />}
      <PostWriteButton onClick={postWriteHandler} />
    </div>
  );
};

export default CommunityPageContent;
