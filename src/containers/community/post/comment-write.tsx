import { useRef } from "react";

import { createCommentApi } from "@/services/community";

import Flight from "@/components/ui/icon/Flight";

import styles from "./comment-write.module.css";

type CommentWriteProps = {
  postId: number;
  refresh: any;
};

export default function CommentWrite({ postId, refresh }: CommentWriteProps) {
  const contentRef = useRef<HTMLInputElement>(null);
  const submitComment = async () => {
    try {
      const res = await createCommentApi(postId, {
        content: contentRef.current?.value,
        parentId: null,
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

  return (
    <div className={styles["comment-form"]}>
      <div className={styles["comment-input"]}>
        <input ref={contentRef} type="text" placeholder="댓글을 입력해 주세요" />
      </div>
      <button className={styles["comment-submit"]} onClick={submitComment}>
        <Flight />
      </button>
    </div>
  );
}
