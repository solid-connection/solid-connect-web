"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { createCommentApi } from "@/services/community";

import styles from "./comment-write.module.css";

import { IconCloseFilled, IconFlight } from "@/public/svgs";

type CommentWriteProps = {
  postId: number;
  curSelectedComment: number | null;
  setCurSelectedComment: React.Dispatch<React.SetStateAction<number | null>>;
  onSuccess: () => void;
};

const CommentWrite = ({ postId, curSelectedComment, setCurSelectedComment, onSuccess }: CommentWriteProps) => {
  const router = useRouter();
  const contentRef = useRef<HTMLInputElement>(null);

  const submitComment = async () => {
    try {
      await createCommentApi({
        postId: postId,
        content: contentRef.current?.value || "",
        parentId: curSelectedComment,
      });
      // router.refresh();
      onSuccess();
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
    <div className={styles["comment-form"]}>
      <div className={styles["comment-input"]}>
        {curSelectedComment && (
          <div className={styles["comment-input-reply"]}>
            <div>답글을 입력중입니다..</div>
            <button
              className={styles["comment-input-close"]}
              onClick={handleCloseComment}
              type="button"
              aria-label="답글 작성 취소"
            >
              <IconCloseFilled />
            </button>
          </div>
        )}
        <input ref={contentRef} type="text" placeholder="댓글을 입력해 주세요" />
      </div>
      <button className={styles["comment-submit"]} onClick={submitComment} type="button" aria-label="댓글 작성">
        <IconFlight />
      </button>
    </div>
  );
};

export default CommentWrite;
