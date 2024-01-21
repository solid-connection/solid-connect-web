import PostCard from "./post-card";

export default function PostCards(props) {
  const { posts } = props;
  return (
    <div style={props.style}>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
