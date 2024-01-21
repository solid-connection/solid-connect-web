import Flight from "@/components/ui/icon/Flight";
import styles from "./comment-write.module.css";

export default function CommentWrite(props) {
  return (
    <div className={styles.commentBox}>
      <div className={styles.commentInput}>
        <input type="text" placeholder="댓글을 입력해 주세요" />
      </div>
      <div className={styles.commentSubmit}>
        <Flight />
      </div>
    </div>
  );
}
