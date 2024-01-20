import Link from "next/link";

import styles from "./post-card.module.css";

export default function PostCard(props) {
  const { id, title, content, createdAt, college } = props;

  return (
    <Link href={`/post/${id}`} className={styles.box}>
      <div className={styles.meta}>
        <div>{createdAt}</div>
        <div>{college}</div>
      </div>
      <div className={styles.title}>{title}</div>
      <p className={styles.content}>{content}</p>
    </Link>
  );
}
