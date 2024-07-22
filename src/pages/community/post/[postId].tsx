import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CommentWrite from "@/containers/community/post/comment-write";
import Comments from "@/containers/community/post/comments";
import Post from "@/containers/community/post/post";

export default function PostPage(props) {
  const { id, title, createdAt, category, content, images, favoriteCount, author, comments } = props;
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <TopDetailNavigation title={props.category} />
      <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
        <Post {...props} />
        <Comments comments={comments} />
        <CommentWrite />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const postData = null;

  return {
    props: {
      ...postData,
    },
  };
}
