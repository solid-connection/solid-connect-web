import Flight from "@/components/ui/icon/Flight";

import styles from "./comment-write.module.css";

export default function CommentWrite(props) {
  return (
    <div className={styles["comment-form"]}>
      <div className={styles["comment-input"]}>
        <input type="text" placeholder="댓글을 입력해 주세요" />
      </div>
      <div className={styles["comment-submit"]}>
        <Flight />
      </div>
    </div>
  );
}
