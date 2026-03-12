"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetPostDetail } from "@/apis/community";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import useReportedPostsStore from "@/lib/zustand/useReportedPostsStore";
import CommentSection from "./CommentSection";
import Content from "./Content";
import KebabMenu from "./KebabMenu";

interface PostPageContentProps {
  boardCode: string;
  postId: number;
}

const PostPageContent = ({ boardCode, postId }: PostPageContentProps) => {
  const router = useRouter();
  const reportedPostIds = useReportedPostsStore((state) => state.reportedPostIds);
  const blockedUserIds = useReportedPostsStore((state) => state.blockedUserIds);
  const isReportedPost = reportedPostIds.includes(postId);

  const { data: post, isLoading, isError, refetch } = useGetPostDetail(postId);
  const isBlockedUserPost = post ? blockedUserIds.includes(post.postFindSiteUserResponse.id) : false;

  useEffect(() => {
    if (isReportedPost) {
      router.replace(`/community/${boardCode}`);
    }
  }, [boardCode, isReportedPost, router]);

  useEffect(() => {
    if (isBlockedUserPost) {
      router.replace(`/community/${boardCode}`);
    }
  }, [boardCode, isBlockedUserPost, router]);

  if (isReportedPost || isBlockedUserPost) {
    return null;
  }

  if (isLoading) {
    return <CloudSpinnerPage />;
  }

  if (isError) {
    // 에러 처리: 토스트 메시지 표시 후 목록 페이지로 이동
    router.replace(`/community/${boardCode}`);
    return null;
  }

  if (!post) {
    // 게시글을 찾을 수 없는 경우
    router.replace(`/community/${boardCode}`);
    return null;
  }

  return (
    <div>
      <TopDetailNavigation
        title="게시글"
        handleBack={() => {
          router.push(`/community/${boardCode}`);
        }}
        icon={
          <KebabMenu
            isOwner={post.isOwner}
            postId={postId}
            boardCode={boardCode}
            authorId={post.isOwner ? undefined : post.postFindSiteUserResponse.id}
          />
        }
      />
      <Content post={post} postId={postId} />
      <CommentSection comments={post.postFindCommentResponses} postId={postId} refresh={refetch} />
    </div>
  );
};

export default PostPageContent;
