import PostCard from "@/components/community/post-card";
import PostCards from "@/components/community/post-cards";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import React, { useRef } from "react";

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
  return (
    <div>
      <PostCards posts={posts} />
    </div>
  );
}
