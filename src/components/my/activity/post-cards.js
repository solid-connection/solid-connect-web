import styles from "./post-cards.module.css";
import PostCard from "./post-card";

export default function PostCards(props) {
  const { title, posts } = props;
  return (
    <div style={{ marginLeft: "20px" }}>
      <div className={styles.title}>{title}</div>
      <div className={styles.container}>
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
