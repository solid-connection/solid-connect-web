import { useRef } from "react";

import { createCommentApi } from "@/services/community";

import Flight from "@/components/ui/icon/Flight";

import { IconCloseFilled, IconFlight } from "../../../../public/svgs";
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

  const handleCloseComment = () => {};

  return (
    <div className={styles["comment-form"]}>
      <div className={styles["comment-input"]}>
        {true && (
          <div className={styles["comment-input-reply"]}>
            <div>답글을 입력중입니다..</div>
            <button className={styles["comment-input-close"]} onClick={handleCloseComment}>
              <IconCloseFilled />
            </button>
          </div>
        )}
        <input ref={contentRef} type="text" placeholder="댓글을 입력해 주세요" />
      </div>
      <button className={styles["comment-submit"]} onClick={submitComment}>
        <IconFlight />
      </button>
    </div>
  );
}
