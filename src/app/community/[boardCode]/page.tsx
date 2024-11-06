"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getPostListApi } from "@/services/community";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/loading/CloudSpinnerPage";
import ButtonTab from "@/components/ui/button-tab";

import CommunityRegionSelector from "./CommunityRegionSelector";
import PostCards from "./PostCards";
import PostWriteButton from "./PostWriteButton";

import { COMMUNITY_BOARDS, COMMUNITY_CATEGORIES } from "@/constants/commnunity";
import { ListPost } from "@/types/community";

const CommunityPage = ({ params }: { params: { boardCode: string } }) => {
  const router = useRouter();
  const { boardCode } = params;
  const [boardDisplayName, setBoardDisplayName] = useState<string>("자유");
  const [category, setCategory] = useState<string>("전체");
  const [posts, setPosts] = useState<ListPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPostListApi(boardCode, category);
        setPosts(res.data.reverse());
        setIsLoading(false);
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

  if (isLoading) {
    return <CloudSpinnerPage />;
  }

  return (
    <>
      <TopDetailNavigation title="커뮤니티" />
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
          color={{ background: "#FAFAFA" }}
          style={{ padding: "10px 0 10px 18px" }}
        />
        <PostCards posts={posts} boardCode={boardCode} />
        <PostWriteButton onClick={postWriteHandler} />
      </div>
    </>
  );
};

export default CommunityPage;
