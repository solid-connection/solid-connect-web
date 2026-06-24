"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetPostDetail } from "@/apis/community";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import useReportedPostsStore from "@/lib/zustand/useReportedPostsStore";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
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
  const blockedPostIds = useReportedPostsStore((state) => state.blockedPostIds);
  const isHiddenPost = reportedPostIds.includes(postId) || blockedPostIds.includes(postId);
  const isDesktop = useIsDesktopViewport();

  const { data: post, isLoading, isError, refetch } = useGetPostDetail(postId);
  const isBlockedUserPost = post ? blockedUserIds.includes(post.postFindSiteUserResponse.id) : false;

  useEffect(() => {
    if (isHiddenPost) {
      router.replace(`/community/${boardCode}`);
    }
  }, [boardCode, isHiddenPost, router]);

  useEffect(() => {
    if (isBlockedUserPost) {
      router.replace(`/community/${boardCode}`);
    }
  }, [boardCode, isBlockedUserPost, router]);

  if (isHiddenPost || isBlockedUserPost) {
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

  if (isDesktop === null) {
    return <div aria-hidden className="min-h-screen bg-white md:bg-k-50" />;
  }

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
        <header className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-primary typo-sb-9">Community</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">게시글</h1>
            <p className="mt-2 text-k-500 typo-medium-2">본문과 댓글을 한 화면에서 확인하고 이어서 대화하세요.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/community/${boardCode}`)}
              className="rounded-lg border border-k-100 bg-white px-4 py-3 text-k-700 transition-colors typo-sb-9 hover:border-primary hover:text-primary"
            >
              목록으로
            </button>
            <KebabMenu
              isOwner={post.isOwner}
              postId={postId}
              boardCode={boardCode}
              authorId={post.isOwner ? undefined : post.postFindSiteUserResponse.id}
            />
          </div>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,760px)_minmax(320px,420px)]">
          <Content post={post} postId={postId} variant="desktop" />
          <CommentSection
            comments={post.postFindCommentResponses}
            postId={postId}
            refresh={refetch}
            variant="desktop"
          />
        </div>
      </div>
    );
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
