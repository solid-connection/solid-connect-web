"use client";

import { useState } from "react";

import { useCreateComment } from "@/apis/community";
import { IconCloseFilled, IconFlight } from "@/public/svgs";

type CommentInputProps = {
  postId: number;
  curSelectedComment: number | null;
  setCurSelectedComment: React.Dispatch<React.SetStateAction<number | null>>;
  refresh: () => void;
};

const CommentInput = ({ postId, curSelectedComment, setCurSelectedComment, refresh }: CommentInputProps) => {
  const [content, setContent] = useState<string>("");

  const createCommentMutation = useCreateComment();

  const submitComment = async () => {
    createCommentMutation.mutate(
      {
        postId: postId,
        content: content,
        parentId: curSelectedComment,
      },
      {
        onSuccess: () => {
          setContent("");
          setCurSelectedComment(null);
        },
      },
    );
  };

  const handleCloseComment = () => {
    setCurSelectedComment(null);
  };

  return (
    <div className="fixed bottom-14 flex w-full min-w-app max-w-app items-center gap-3 border-t border-bg-400 bg-k-0 p-2">
      <div className="w-full">
        {curSelectedComment && (
          <div className="flex h-10 w-full items-center justify-between rounded-t-lg bg-bg-500 px-2.5 pb-2.5 pt-3">
            <span className="text-gray-150 typo-regular-4">답글을 입력중입니다..</span>
            <button
              className="cursor-pointer border-none bg-transparent"
              onClick={handleCloseComment}
              type="button"
              aria-label="답글 작성 취소"
            >
              <IconCloseFilled />
            </button>
          </div>
        )}
        <input
          className="h-10 w-full overflow-hidden text-ellipsis rounded-lg border-none bg-bg-400 p-2.5 outline-none typo-regular-2 placeholder:text-gray-150"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder="댓글을 입력해 주세요"
        />
      </div>
      <button
        className="mb-2 mr-1 mt-auto cursor-pointer border-none bg-transparent"
        onClick={submitComment}
        type="button"
        aria-label="댓글 작성"
      >
        <IconFlight />
      </button>
    </div>
  );
};

export default CommentInput;
