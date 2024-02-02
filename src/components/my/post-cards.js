import Link from "next/link";

import styles from "./post-cards.module.css";

export default function PostCards(props) {
  const { posts } = props;
  return (
    <div className={styles.container} style={{ margin: "20px 20px 0 20px" }}>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}

export function PostCard(props) {
  const { id, title, content, createdAt, college } = props;

  return (
    <Link href={`/community/post/${id}`} className={styles.box}>
      <div className={styles.meta}>
        <div>{createdAt}</div>
        <div>{college}</div>
      </div>
      <div className={styles.title}>{title}</div>
      <p className={styles.content}>{content}</p>
    </Link>
  );
}
