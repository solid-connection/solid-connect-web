import Link from "next/link";

import styles from "./post-cards.module.css";

type Post = {
  // 아직 미정
  id: number;
  title: string;
  content: string;
  createdAt: string;
  college: string;
};

type PostCardsProps = {
  posts: Post[];
};

const PostCards = ({ posts }: PostCardsProps) => (
  <div className={styles.container} style={{ margin: "20px 20px 0 20px" }}>
    {posts.map((post) => (
      <PostCard key={post.id} post={post} />
    ))}
  </div>
);

export default PostCards;

type PostCardProps = {
  post: Post;
};
export const PostCard = ({ post }: PostCardProps) => (
  <Link href={`/community/post/${post.id}`} className={styles.box}>
    <div className={styles.meta}>
      <div>{post.createdAt}</div>
      <div>{post.college}</div>
    </div>
    <div className={styles.title}>{post.title}</div>
    <p className={styles.content}>{post.content}</p>
  </Link>
);
