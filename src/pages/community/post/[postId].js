import Head from "next/head";

import { getPostDetail } from "@/pages/api/post/[id]";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Post from "@/components/community/post/post";
import Comments from "@/components/community/post/comments";
import CommentWrite from "@/components/community/post/comment-write";

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

export async function getServerSideProps(context) {
  const { params } = context;
  const { postId } = params;

  const postData = await getPostDetail(postId);

  return {
    props: {
      ...postData,
    },
  };
}
