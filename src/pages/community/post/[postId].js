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
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const token = req.cookies["accessToken"];

  // 토큰 유효성 검사 로직 (예제 코드)
  const isValid = token ? true : false; // 실제로는 토큰의 유효성을 검증하는 로직이 필요합니다.

  if (!isValid) {
    // 비로그인 상태일 경우 로그인 페이지로 리다이렉트
    return {
      redirect: {
        destination: "/login/kakao",
        permanent: false,
      },
    };
  }

  const { params } = context;
  const { postId } = params;

  const postData = await getPostDetail(postId);

  return {
    props: {
      ...postData,
    },
  };
}
