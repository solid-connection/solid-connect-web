"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/loading/CloudSpinnerPage";

import CommentWrite from "./CommentInput";
import Comments from "./Comments";
import Content from "./Content";
import KebabMenu from "./KebabMenu";

import { Post as PostType } from "@/types/community";

import { getPostDetailApi } from "@/api/community";

interface PostPageContentProps {
  boardCode: string;
  postId: number;
}

const PostPageContent = ({ boardCode, postId }: PostPageContentProps) => {
  const router = useRouter();

  const { post, isLoading, refresh } = useFetchPost(postId);

  if (isLoading || post === null) {
    return <CloudSpinnerPage />;
  }

  return (
    <div>
      <TopDetailNavigation
        title="게시글"
        handleBack={() => {
          router.push(`/community/${boardCode}`);
        }}
        icon={post.isOwner && <KebabMenu boardCode={boardCode} postId={postId} />}
      />
      <Content post={post} postId={postId} />
      <Comments comments={post.postFindCommentResponses} postId={postId} refresh={refresh} />
    </div>
  );
};

const useFetchPost = (postId: number) => {
  const [post, setPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPost = async () => {
    try {
      const response = await getPostDetailApi(postId);
      setPost(response.data);
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

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const refresh = () => {
    setIsLoading(true);
    fetchPost();
  };

  return { post, isLoading, refresh };
};

export default PostPageContent;
