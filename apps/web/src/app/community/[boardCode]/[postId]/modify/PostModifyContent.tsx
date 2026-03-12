"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetPostDetail } from "@/apis/community";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import PostModifyForm from "./PostModifyForm";

interface PostModifyContentProps {
  boardCode: string;
  postId: number;
}

const PostModifyContent = ({ boardCode, postId }: PostModifyContentProps) => {
  const router = useRouter();
  const { data: post, isLoading, isError } = useGetPostDetail(postId);

  useEffect(() => {
    if (isError) {
      // 오류 발생 시 목록 페이지로 이동
      router.push(`/community/${boardCode}`);
    }
  }, [isError, boardCode, router]);

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
