"use client";

import Image from "next/image";
import { useState } from "react";

import clsx from "clsx";

import { convertISODateToDateTime } from "@/utils/datetimeUtils";
import { convertUploadedImageUrl } from "@/utils/fileUtils";

import Dropdown from "@/components/ui/Dropdown";

import CommentInput from "./CommentInput";

import { Comment as CommentType, CommunityUser } from "@/types/community";

import useDeleteComment from "@/api/community/client/useDeleteComment";
import { IconMoreVertFilled, IconSubComment } from "@/public/svgs";

type CommentSectionProps = {
  comments: CommentType[];
  postId: number;
  refresh: () => void;
};

const CommentSection = ({ comments, postId, refresh }: CommentSectionProps) => {
  const [curSelectedComment, setCurSelectedComment] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const deleteCommentMutation = useDeleteComment();

  const deleteComment = (commentId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    deleteCommentMutation.mutate({ commentId, postId });
  };

  return (
    <div className="min-h-[50vh] pb-[49px]">
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          setCurSelectedComment={setCurSelectedComment}
          deleteComment={deleteComment}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />
      ))}
      <CommentInput
        postId={postId}
        curSelectedComment={curSelectedComment}
        setCurSelectedComment={setCurSelectedComment}
        refresh={refresh}
      />
    </div>
  );
};

export default CommentSection;

type CommentProps = {
  comment: CommentType;
  setCurSelectedComment: (commentId: number | null) => void;
  deleteComment: (commentId: number) => void;
  activeDropdown: number | null;
  setActiveDropdown: (commentId: number | null) => void;
};

const Comment = ({
  comment,
  setCurSelectedComment,
  deleteComment,
  activeDropdown,
  setActiveDropdown,
}: CommentProps) => {
  const toggleDropdown = (commentId: number) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId);
  };

  const isDeleted = comment.content === "";

  return (
    <div
      className={clsx(
        "flex border-b border-gray-c-100 px-5 py-[18px]",
        comment.parentId !== null ? "bg-line-1" : "bg-[#fafafa]",
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
          {comment.isOwner && (
            <CommentDropdown
              commentId={comment.id}
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
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

const CommentProfile = ({ user }: { user: CommunityUser }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-[25px] w-[25px] rounded-full bg-bg-600">
        <Image
          className="h-full w-full rounded-full"
          src={
            user?.profileImageUrl ? convertUploadedImageUrl(user?.profileImageUrl) : "/images/placeholder/profile64.svg"
          }
          width={40}
          height={40}
          alt="alt"
        />
      </div>
      <div className="overflow-hidden text-black typo-medium-2">{user?.nickname}</div>
    </div>
  );
};

const CommentDropdown = ({
  commentId,
  activeDropdown,
  toggleDropdown,
  deleteComment,
}: {
  commentId: number;
  activeDropdown: number | null;
  toggleDropdown: (commentId: number) => void;
  deleteComment: (commentId: number) => void;
}) => {
  return (
    <div className="relative">
      <button className="cursor-pointer" onClick={() => toggleDropdown(commentId)} aria-label="더보기">
        <IconMoreVertFilled />
      </button>
      {activeDropdown === commentId && (
        <Dropdown
          options={[
            {
              label: "삭제하기",
              action: () => {
                deleteComment(commentId);
              },
            },
          ]}
        />
      )}
    </div>
  );
};
