import Image from "next/image";

import styles from "./comments.module.css";

export default function Comments(props) {
  const { comments } = props;
  return (
    <div>
      {comments?.map((comment) => (
        <div className={styles.comment} key={comment.id}>
          <div className={styles.commentAuthor}>
            <div className={styles.commentAuthorProfileImage}>
              {comment.author.profileImage && (
                <Image src={comment.author.profileImage} width={40} height={40} alt="alt" />
              )}
            </div>
            <div className={styles.commentAuthorName}>{comment.author.name}</div>
          </div>
          <div className={styles.commentContent}>{comment.content}</div>
          <div className={styles.commentCreatedAt}>{comment.createdAt}</div>
        </div>
      ))}
    </div>
  );
}
