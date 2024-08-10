import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getPostListApi } from "@/services/community";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ButtonTab from "@/components/ui/button-tab";
import CommunityRegionSelector from "@/containers/community/community-region-selector";
import PostCards from "@/containers/community/post-cards";
import PostWriteButton from "@/containers/community/post-write-button";

import { COMMUNITY_BOARDS, COMMUNITY_CATEGORIES } from "@/constants/commnunity";
import { ListPost } from "@/types/community";

export default function CommunityPage({ boardCode }: { boardCode: string }) {
  const [board, setBoard] = useState<string>(boardCode);
  const [boardDisplayName, setBoardDisplayName] = useState<string>("자유");
  const [category, setCategory] = useState<string>("전체");
  const [posts, setPosts] = useState<ListPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      await getPostListApi(board, category)
        .then((res) => {
          setPosts(res.data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response);
            alert(err.response.data?.message);
          } else if (err.reqeust) {
            console.error("Axios request error", err.request);
          } else {
            console.error("Error", err.message);
            alert(err.message);
          }
          document.location.href = "/login"; // 로그인 페이지로 이동
        });
    };
    fetchPosts();
    setBoardDisplayName(COMMUNITY_BOARDS.find((b) => b.code === board)?.nameKo);
  }, [board, category]);

  const router = useRouter();
  const postWriteHandler = () => {
    router.push("/community/post/create");
  };

  return (
    <>
      <Head>
        <title>커뮤니티</title>
      </Head>
      <TopDetailNavigation title="커뮤니티" />
      <div>
        <CommunityRegionSelector
          curRegion={boardDisplayName}
          setCurRegion={setBoard}
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
}

export async function getServerSideProps({ params }) {
  const { boardCode }: { boardCode: string } = params;
  return {
    props: {
      boardCode,
    },
  };
}
