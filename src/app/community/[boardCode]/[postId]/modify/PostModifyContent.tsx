"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import PostModifyForm from "./PostModifyForm";

import { Post } from "@/types/community";

import { getPostDetailApi } from "@/api/community";

interface PostModifyContentProps {
  boardCode: string;
  postId: number;
}

const PostModifyContent = ({ boardCode, postId }: PostModifyContentProps) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostDetailApi(postId);
        setPost(res.data);
      } catch (err) {
        // 에러 처리
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
        // 오류 발생 시 목록 페이지로 이동
        router.push(`/community/${boardCode}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [boardCode, postId, router]);

  if (isLoading) {
    return <CloudSpinnerPage />;
  }

  if (!post) {
    return <div>게시글을 불러오는 데 오류가 발생했습니다.</div>;
  }

  return (
    <div>
      <PostModifyForm
        boardCode={boardCode}
        postId={postId}
        defaultTitle={post.title}
        defaultContent={post.content}
        defaultIsQuestion={post.isQuestion}
        defaultPostCategory={post.postCategory}
      />
    </div>
  );
};

export default PostModifyContent;
