import { useState, useEffect } from "react";
import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import PostCards from "@/components/my/post-cards";
import ScrollTab from "@/components/ui/scroll-tab";

export default function MyActivityPage() {
  const posts = [
    {
      id: 1,
      title: "보라스 대학교에 관한 정보",
      content:
        "안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ ",
      createdAt: "2024. 1. 1.",
      college: "보라스 대학교",
    },
    {
      id: 2,
      title: "보라스 대학교에 관한 정보",
      content: "2 ",
      createdAt: "2024. 1. 1.",
      college: "보라스 대학교",
    },
  ];
  const commentPosts = [
    {
      id: 1,
      title: "보라스 대학교에 관한 정보123",
      content:
        "안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ ",
      createdAt: "2024. 1. 1.",
      college: "보라스 대학교",
    },
    {
      id: 2,
      title: "보라스 대학교에 관한 정보",
      content: "2 ",
      createdAt: "2024. 1. 1.",
      college: "보라스 대학교",
    },
  ];
  const choices = ["작성글", "작성 댓글"];
  const [choice, setChoice] = useState(choices[0]);
  return (
    <>
      <Head>
        <title>활동내역</title>
      </Head>
      <TopDetailNavigation title="활동내역" />
      <ScrollTab choices={choices} choice={choice} setChoice={setChoice} />
      <PostCards posts={choice === choices[0] ? posts : commentPosts} />
    </>
  );
}

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const token = req.cookies["accessToken"];

  // 토큰 유효성 검사 로직 (예제 코드)
  const isLogin = token ? true : false;

  if (!isLogin) {
    // 비로그인 상태일 경우 로그인 페이지로 리다이렉트
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
