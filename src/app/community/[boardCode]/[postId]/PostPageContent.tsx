"use client";

import { useRouter } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";

import CommentSection from "./CommentSection";
import Content from "./Content";
import KebabMenu from "./KebabMenu";

import useGetPostDetail from "@/api/community/client/useGetPostDetail";

interface PostPageContentProps {
  boardCode: string;
  postId: number;
}

const PostPageContent = ({ boardCode, postId }: PostPageContentProps) => {
  const router = useRouter();

  const { data: post, isLoading, refetch } = useGetPostDetail(postId);

  if (isLoading || !post) {
    return <CloudSpinnerPage />;
  }

  return (
    <div>
      <TopDetailNavigation
        title="게시글"
        handleBack={() => {
          router.push(`/community/${boardCode}`);
        }}
        icon={<KebabMenu isOwner={post.isOwner} postId={postId} boardCode={boardCode} />}
      />
      <Content post={post} postId={postId} />
      <CommentSection comments={post.postFindCommentResponses} postId={postId} refresh={refetch} />
    </div>
  );
};

export default PostPageContent;
