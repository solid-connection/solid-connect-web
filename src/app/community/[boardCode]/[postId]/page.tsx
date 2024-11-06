"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getPostDetailApi } from "@/services/community";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/loading/CloudSpinnerPage";

import CommentWrite from "./CommentWrite";
import Comments from "./Comments";
import KebabMenu from "./KebabMenu";
import Post from "./Post";

import { Post as PostType } from "@/types/community";

const PostPage = ({ params }: { params: { boardCode: string; postId: string } }) => {
  const router = useRouter();
  const { boardCode } = params;
  const postId = Number(params.postId);
  const [post, setPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [curSelectedComment, setCurSelectedComment] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      await getPostDetailApi(boardCode, postId)
        .then((res) => {
          setPost(res.data);
        })
        .catch((err) => {
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
        });
      setIsLoading(false);
    };
    fetchPosts();
  }, [boardCode, postId]);

  if (isLoading) {
    return <CloudSpinnerPage />;
  }

  return (
    <>
      {/* 페이지 타이틀을 설정하려면 metadata API를 사용할 수 있습니다 */}
      <TopDetailNavigation
        title={post?.postFindBoardResponse.koreanName}
        handleBack={() => {
          router.push(`/community/${boardCode}`);
        }}
        icon={post?.isOwner && <KebabMenu boardCode={boardCode} postId={postId} />}
      />
      <div>
        <Post post={post} boardCode={boardCode} postId={postId} />
        <Comments
          comments={post?.postFindCommentResponses}
          postId={postId}
          refresh={() => {
            router.refresh();
          }}
          setCurSelectedComment={setCurSelectedComment}
        />
        <CommentWrite
          postId={postId}
          refresh={() => {
            router.refresh();
          }}
          curSelectedComment={curSelectedComment}
          setCurSelectedComment={setCurSelectedComment}
        />
      </div>
    </>
  );
};

export default PostPage;
