import { ListCollege } from "@/types/college";
import { useState, useEffect } from "react";
import Head from "next/head";
import apiClient from "@/lib/axiosClient";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ScrollTab from "@/components/ui/scroll-tab";
import CollegeCards from "@/components/college/list/college-cards";
import PostCards from "@/components/my/post-cards";

export default function MyScrapPage() {
  const posts = [
    // {
    //   id: 1,
    //   title: "보라스 대학교에 관한 정보",
    //   content:
    //     "안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면ㅊ ",
    //   createdAt: "2024. 1. 1.",
    //   college: "보라스 대학교",
    // },
  ];
  const [wishColleges, setWishColleges] = useState<ListCollege[]>([]);
  useEffect(() => {
    async function getWishColleges() {
      try {
        const response = await apiClient.get("/my-page/wish-university");
        const data: ListCollege[] = response.data.data;
        setWishColleges(data);
      } catch (error) {
        console.error(error.toString());
        let errorMessage = error.toString();
        const detailedErrorMessage = error?.response?.data?.error?.message ?? "";
        if (detailedErrorMessage) errorMessage += "\n" + detailedErrorMessage;
        alert(errorMessage);
      }
    }
    getWishColleges();
  }, []);

  // const tabs = ["스크랩 한 글", "멘토", "위시학교"];
  const tabs = ["위시학교"];
  const [tab, setTab] = useState(tabs[0]);

  return (
    <>
      <Head>
        <title>즐거찾기</title>
      </Head>
      <TopDetailNavigation title="즐거찾기" />
      <ScrollTab choices={tabs} choice={tab} setChoice={setTab} />
      {(() => {
        switch (tab) {
          case tabs[0]:
            return <CollegeCards colleges={wishColleges} style={{ marginTop: "20px" }} />;
          // case tabs[1]:
          // return <PostCards posts={posts} />;
          // case tabs[2]:
          // return <></>;
          default:
            return null; // 기본값으로 null 반환을 추가하는 것이 좋습니다.
        }
      })()}
    </>
  );
}
