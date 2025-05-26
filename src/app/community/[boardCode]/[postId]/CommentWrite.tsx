"use client";

import { useState } from "react";

import { createCommentApi } from "@/api/community";
import { IconCloseFilled, IconFlight } from "@/public/svgs";

type CommentWriteProps = {
  postId: number;
  curSelectedComment: number | null;
  setCurSelectedComment: React.Dispatch<React.SetStateAction<number | null>>;
  refresh: () => void;
};

const CommentWrite = ({ postId, curSelectedComment, setCurSelectedComment, refresh }: CommentWriteProps) => {
  const [content, setContent] = useState<string>("");

  const submitComment = async () => {
    try {
      await createCommentApi({
        postId: postId,
        content: content,
        parentId: curSelectedComment,
      });
      refresh();
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
    }
  };

  const handleCloseComment = () => {
    setCurSelectedComment(null);
  };

  return (
    <div className="fixed bottom-14 flex w-full min-w-[360px] max-w-[600px] items-center gap-3 border-t border-[#ececec] bg-k-0 p-2">
      <div className="w-full">
        {curSelectedComment && (
          <div className="flex h-10 w-full items-center justify-between rounded-t-lg bg-[#e2e2e2] px-2.5 pb-2.5 pt-3">
            <span className="text-xs font-normal leading-normal text-[#808080]">답글을 입력중입니다..</span>
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
          className="h-10 w-full overflow-hidden text-ellipsis rounded-lg border-none bg-[#ececec] p-2.5 text-sm font-normal leading-normal outline-none placeholder:text-[#808080]"
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

export default CommentWrite;
