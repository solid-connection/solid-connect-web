// 미사용 페이지
import Head from "next/head";
import { useState } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ScrollTab from "@/components/ui/scroll-tab";
import PostCards from "@/containers/my/post-cards";

export default function MyActivityPage() {
  const posts = [
    // {
    //   id: 1,
    //   title: "보라스 대학교에 관한 정보",
    //   content:
    //     "안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ ",
    //   createdAt: "2024. 1. 1.",
    //   college: "보라스 대학교",
    // },
    // {
    //   id: 2,
    //   title: "보라스 대학교에 관한 정보",
    //   content: "2 ",
    //   createdAt: "2024. 1. 1.",
    //   college: "보라스 대학교",
    // },
  ];
  const commentPosts = [
    // {
    //   id: 1,
    //   title: "보라스 대학교에 관한 정보123",
    //   content:
    //     "안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ ",
    //   createdAt: "2024. 1. 1.",
    //   college: "보라스 대학교",
    // },
    // {
    //   id: 2,
    //   title: "보라스 대학교에 관한 정보",
    //   content: "2 ",
    //   createdAt: "2024. 1. 1.",
    //   college: "보라스 대학교",
    // },
  ];
  const choices = ["작성글", "작성 댓글"];
  const [choice, setChoice] = useState(choices[0]);

  return <div>준비중입니다</div>;
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
