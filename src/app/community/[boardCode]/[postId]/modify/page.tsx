"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getPostDetailApi } from "@/services/community";

import PostModifyForm from "./PostModifyForm";

import { Post } from "@/types/community";

const PostModifyPage = ({ params }: { params: { boardCode: string; postId: string } }) => {
  const { boardCode, postId } = params;
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostDetailApi(Number(postId));
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
    return <div>로딩 중...</div>; // 로딩 스피너 컴포넌트를 사용할 수 있습니다.
  }

  if (!post) {
    return <div>게시글을 불러오는 데 오류가 발생했습니다.</div>;
  }

  return (
    <div>
      <PostModifyForm
        boardCode={boardCode}
        postId={Number(postId)}
        defaultTitle={post.title}
        defaultContent={post.content}
        defaultIsQuestion={post.isQuestion}
        defaultPostCategory={post.postCategory}
      />
    </div>
  );
};

export default PostModifyPage;
