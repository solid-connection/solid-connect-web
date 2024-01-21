import Head from "next/head";

import { getPostDetail } from "@/pages/api/post/[id]";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Post from "@/components/community/post/post";
export default function PostPage(props) {
  const { id, title, createdAt, category, content, images, favoriteCount, author, comments } = props;
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <TopDetailNavigation title={props.category} />
      <Post {...props} />
      {/* <Comments /> */}
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
