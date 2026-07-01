"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { useDeleteComment } from "@/apis/community";
import useBlockCommunityUser from "@/app/community/_hooks/useBlockCommunityUser";
import Dropdown from "@/components/ui/Dropdown";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import useReportedPostsStore from "@/lib/zustand/useReportedPostsStore";
import { IconMoreVertFilled, IconSubComment } from "@/public/svgs";
import type { Comment as CommentType, CommunityUser } from "@/types/community";
import { convertISODateToDateTime } from "@/utils/datetimeUtils";
import { DesktopCommentInput, MobileCommentInput } from "./CommentInput";

type CommentSectionProps = {
  comments: CommentType[];
  postId: number;
  refresh: () => void;
};

const CommentSectionBase = ({ comments, postId, refresh, isDesktop }: CommentSectionProps & { isDesktop: boolean }) => {
  const [curSelectedComment, setCurSelectedComment] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const blockedUserIds = useReportedPostsStore((state) => state.blockedUserIds);
  const Comment = isDesktop ? DesktopComment : MobileComment;
  const CommentInput = isDesktop ? DesktopCommentInput : MobileCommentInput;

  const deleteCommentMutation = useDeleteComment();

  const visibleComments = useMemo(() => {
    if (blockedUserIds.length === 0) {
      return comments;
    }

    const blockedUserIdSet = new Set(blockedUserIds);

    return comments.filter((comment) => !blockedUserIdSet.has(comment.postFindSiteUserResponse.id));
  }, [comments, blockedUserIds]);

  const deleteComment = (commentId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    deleteCommentMutation.mutate({ commentId, postId });
  };

  const commentList = (
    <>
      {visibleComments.length === 0 && (
        <div className="flex min-h-40 items-center justify-center text-k-400 typo-regular-2">아직 댓글이 없습니다.</div>
      )}
      {visibleComments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          setCurSelectedComment={setCurSelectedComment}
          deleteComment={deleteComment}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />
      ))}
    </>
  );

  if (isDesktop) {
    return (
      <aside className="flex max-h-[calc(100vh-132px)] min-h-[520px] flex-col rounded-lg border border-k-100 bg-white">
        <div className="flex items-center justify-between border-b border-k-100 px-5 py-4">
          <h2 className="text-k-900 typo-bold-4">댓글</h2>
          <span className="text-primary typo-sb-9">{visibleComments.length}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">{commentList}</div>
        <CommentInput
          postId={postId}
          curSelectedComment={curSelectedComment}
          setCurSelectedComment={setCurSelectedComment}
          refresh={refresh}
        />
      </aside>
    );
  }

  return (
    <div className="min-h-[50vh] pb-[49px]">
      {commentList}
      <CommentInput
        postId={postId}
        curSelectedComment={curSelectedComment}
        setCurSelectedComment={setCurSelectedComment}
        refresh={refresh}
      />
    </div>
  );
};

export const DesktopCommentSection = (props: CommentSectionProps) => <CommentSectionBase {...props} isDesktop />;

export const MobileCommentSection = (props: CommentSectionProps) => <CommentSectionBase {...props} isDesktop={false} />;

export default MobileCommentSection;

type CommentProps = {
  comment: CommentType;
  setCurSelectedComment: (commentId: number | null) => void;
  deleteComment: (commentId: number) => void;
  activeDropdown: number | null;
  setActiveDropdown: (commentId: number | null) => void;
};

const CommentBase = ({
  comment,
  setCurSelectedComment,
  deleteComment,
  activeDropdown,
  setActiveDropdown,
  isDesktop,
}: CommentProps & { isDesktop: boolean }) => {
  const toggleDropdown = (commentId: number) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId);
  };

  const isDeleted = comment.content === "";

  return (
    <div
      className={clsx(
        "flex border-b border-gray-c-100 px-5 py-[18px]",
        isDesktop && "transition-colors hover:bg-k-50",
        comment.parentId !== null ? "bg-line-1" : "bg-magic-comment-reply-bg",
      )}
      key={comment.id}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (comment.parentId !== null) {
          setCurSelectedComment(comment.parentId);
          return;
        }
        setCurSelectedComment(comment.id);
      }}
      onKeyDown={(e) => {
        // Handles keyboard events
        if (e.key === "Enter" || e.key === " ") {
          if (comment.parentId !== null) {
            setCurSelectedComment(comment.id);
            return;
          }
          setCurSelectedComment(comment.parentId);
        }
      }}
    >
      {comment.parentId !== null && (
        <div className="mr-1.5">
          <IconSubComment />
        </div>
      )}
      <div className="flex w-full flex-col">
        <div className="flex justify-between">
          <CommentProfile
            user={{
              ...comment.postFindSiteUserResponse,
              nickname: isDeleted ? "알 수 없음" : comment.postFindSiteUserResponse.nickname,
            }}
          />
          {!isDeleted && (
            <CommentDropdown
              commentId={comment.id}
              isOwner={comment.isOwner}
              authorId={comment.postFindSiteUserResponse.id}
              authorNickname={comment.postFindSiteUserResponse.nickname}
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              setActiveDropdown={setActiveDropdown}
              deleteComment={deleteComment}
            />
          )}
        </div>
        <div className="mt-3 text-black typo-regular-2">{isDeleted ? "삭제된 댓글입니다" : comment.content}</div>
        <div className="mt-2 overflow-hidden text-gray-250 typo-regular-4">
          {convertISODateToDateTime(comment.createdAt) || "1970. 01. 01. 00:00"}
        </div>
      </div>
    </div>
  );
};

const DesktopComment = (props: CommentProps) => <CommentBase {...props} isDesktop />;

const MobileComment = (props: CommentProps) => <CommentBase {...props} isDesktop={false} />;

const CommentProfile = ({ user }: { user: CommunityUser }) => {
  return (
    <div className="flex items-center gap-2">
      <ProfileWithBadge profileImageUrl={user?.profileImageUrl} width={25} height={25} />
      <div className="overflow-hidden text-black typo-medium-2">{user?.nickname}</div>
    </div>
  );
};

const CommentDropdown = ({
  commentId,
  isOwner,
  authorId,
  authorNickname,
  activeDropdown,
  toggleDropdown,
  setActiveDropdown,
  deleteComment,
}: {
  commentId: number;
  isOwner: boolean;
  authorId: number;
  authorNickname: string;
  activeDropdown: number | null;
  toggleDropdown: (commentId: number) => void;
  setActiveDropdown: (commentId: number | null) => void;
  deleteComment: (commentId: number) => void;
}) => {
  const { handleBlockUser } = useBlockCommunityUser({
    onBlocked: () => setActiveDropdown(null),
  });

  const options = isOwner
    ? [
        {
          label: "삭제하기",
          action: () => {
            deleteComment(commentId);
          },
        },
      ]
    : [
        {
          label: "차단하기",
          action: () => {
            setActiveDropdown(null);
            void handleBlockUser({ userId: authorId, nickname: authorNickname });
          },
        },
      ];

  return (
    <div className="relative" onClick={(event) => event.stopPropagation()}>
      <button className="cursor-pointer" onClick={() => toggleDropdown(commentId)} aria-label="더보기">
        <IconMoreVertFilled />
      </button>
      {activeDropdown === commentId && <Dropdown options={options} />}
    </div>
  );
};
