"use client";

import Image from "next/image";
import { useState } from "react";

import clsx from "clsx";

import { convertISODateToDateTime } from "@/utils/datetimeUtils";

import Dropdown from "@/components/ui/Dropdown";

import CommentInput from "./CommentInput";

import { Comment } from "@/types/community";

import { deleteCommentApi } from "@/api/community";
import { IconMoreVertFilled, IconSubComment } from "@/public/svgs";

type CommentsProps = {
  comments: Comment[];
  postId: number;
  setCurSelectedComment: React.Dispatch<React.SetStateAction<number | null>>;
  refresh: () => void;
};

const Comments = ({ comments, postId, setCurSelectedComment, refresh }: CommentsProps) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDeleteComment = (commentId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    deleteCommentApi(postId, commentId)
      .then(() => {
        refresh();
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
  };

  const toggleDropdown = (commentId: number) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId);
  };

  return (
    <div className="min-h-[50vh] pb-[49px]">
      {comments?.map((comment) => (
        <div
          className={clsx(
            "flex border-b border-[#ececec] px-5 py-[18px]",
            comment.parentId !== null ? "bg-[#f2f2f2]" : "bg-[#fafafa]",
          )}
          key={comment.id}
          role="button"
          tabIndex={0}
          onClick={() => {
            if (comment.parentId === null) setCurSelectedComment(comment.id);
            else {
              setCurSelectedComment(comment.parentId);
            }
          }}
          onKeyDown={(e) => {
            // Handles keyboard events
            if (e.key === "Enter" || e.key === " ") {
              if (comment.parentId === null) setCurSelectedComment(comment.id);
              else {
                setCurSelectedComment(comment.parentId);
              }
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
              <div className="flex items-center gap-2">
                <div className="h-[25px] w-[25px] rounded-full bg-[#d9d9d9]">
                  <Image
                    className="h-full w-full rounded-full"
                    src={
                      comment.postFindSiteUserResponse.profileImageUrl
                        ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${comment.postFindSiteUserResponse.profileImageUrl}`
                        : "/images/placeholder/profile64.svg"
                    }
                    width={40}
                    height={40}
                    alt="alt"
                  />
                </div>
                <div className="overflow-hidden text-sm font-medium leading-normal text-black">
                  {comment.postFindSiteUserResponse.nickname}
                </div>
              </div>
              {comment.isOwner && (
                <div className="relative">
                  <button
                    className="cursor-pointer"
                    onClick={() => toggleDropdown(comment.id)}
                    type="button"
                    aria-label="더보기"
                  >
                    <IconMoreVertFilled />
                  </button>
                  {activeDropdown === comment.id && (
                    <Dropdown
                      options={[
                        {
                          label: "삭제하기",
                          action: () => {
                            toggleDeleteComment(comment.id);
                          },
                        },
                      ]}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="mt-3 text-sm font-normal leading-normal text-black">{comment.content}</div>
            <div className="mt-2 overflow-hidden text-xs font-normal leading-normal text-[#7c7c7c]">
              {convertISODateToDateTime(comment.createdAt) || "1970. 01. 01. 00:00"}
            </div>
          </div>
        </div>
      ))}
      <CommentInput
        postId={postId}
        curSelectedComment={null}
        setCurSelectedComment={setCurSelectedComment}
        refresh={refresh}
      />
    </div>
  );
};

export default Comments;
