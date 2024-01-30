import styles from "./post-cards.module.css";
import PostCard from "./post-card";

export default function PostCards(props) {
  const { title, posts } = props;
  return (
    <div className={styles.container} style={{ margin: "20px 0 0 20px" }}>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
