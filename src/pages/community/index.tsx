import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import PostCards from "@/components/community/post-cards";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ButtonTab from "@/components/ui/button-tab";
import PostWriteButton from "@/components/community/post-write-button";

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      title: "보라스 대학교에 관한 정보",
      content: "안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ ",
      category: "동행",
      date: "2024. 1. 1.",
      favoriteCount: 1,
      commentCount: 1,
      image: "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    },
    {
      id: 2,
    },
    {
      id: 3,
      title: "보라스 대학교에 관한 정보",
      content: "안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ ",
    },
  ];
  const categories = ["전체", "입학준비", "무료양도", "거래", "동행", "자유"];
  const [category, setCategory] = useState("전체");

  const communityTitleStyle = {
    margin: "20px 0 14px 20px",
    color: "#000",
    fontFamily: "Pretendard",
    fontSize: "22px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "150%", // 33px;
  };

  const router = useRouter();
  const postWriteHandler = () => {
    router.push("/community/post/create");
  };

  return (
    <>
      <Head>
        <title>커뮤니티</title>
      </Head>
      <TopDetailNavigation title="커뮤니티" />
      <div>
        <div style={communityTitleStyle}>프랑스</div>
        <ButtonTab choices={categories} choice={category} setChoice={setCategory} color={{ background: "#FAFAFA" }} style={{ padding: "10px 0 10px 18px" }} />
        <PostCards posts={posts} />
        <PostWriteButton onClick={postWriteHandler} />
      </div>
    </>
  );
}
