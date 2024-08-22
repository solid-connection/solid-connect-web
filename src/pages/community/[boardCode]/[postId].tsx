import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getPostDetailApi } from "@/services/community";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CommentWrite from "@/containers/community/post/comment-write";
import Comments from "@/containers/community/post/comments";
import Post from "@/containers/community/post/post";

import { Post as PostType } from "@/types/community";

export default function PostPage({ boardCode, postId }: { boardCode: string | any; postId: number | any }) {
  const router = useRouter();
  const [post, setPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      await getPostDetailApi(boardCode, postId)
        .then((res) => {
          setPost(res.data);
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
          document.location.href = "/login";
        });
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <TopDetailNavigation
        title={post.postFindBoardResponse.koreanName}
        handleBack={() => {
          router.push(`/community/${boardCode}`);
        }}
      />
      <div style={{ minHeight: "100vh" }}>
        <Post post={post} />
        <Comments comments={[]} />
        <CommentWrite />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { boardCode, postId }: { boardCode: string; postId: number } = params;
  return {
    props: {
      boardCode,
      postId,
    },
  };
}
