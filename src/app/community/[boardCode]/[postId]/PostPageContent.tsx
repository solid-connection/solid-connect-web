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

interface PostPageContentProps {
  boardCode: string;
  postId: number;
}

const PostPageContent = ({ boardCode, postId }: PostPageContentProps) => {
  const router = useRouter();
  const [post, setPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [curSelectedComment, setCurSelectedComment] = useState<number | null>(null);

  const fetchPosts = async () => {
    await getPostDetailApi(postId)
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

  useEffect(() => {
    fetchPosts();
  }, [postId]);

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
        icon={<KebabMenu boardCode={boardCode} postId={postId} />}
      />
      <Post post={post} boardCode={boardCode} postId={postId} />
      <Comments
        comments={post.postFindCommentResponses}
        postId={postId}
        refresh={() => {
          router.refresh();
        }}
        setCurSelectedComment={setCurSelectedComment}
        onSuccess={fetchPosts}
      />
      <CommentWrite
        postId={postId}
        curSelectedComment={curSelectedComment}
        setCurSelectedComment={setCurSelectedComment}
        onSuccess={fetchPosts}
      />
    </div>
  );
};

export default PostPageContent;
