import { useState } from "react";
import Head from "next/head";

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
    // {
    //   id: 2,
    //   title: "보라스 대학교에 관한 정보",
    //   content: "2 ",
    //   createdAt: "2024. 1. 1.",
    //   college: "보라스 대학교",
    // },
  ];
  const colleges = [
    // {
    //   id: 97,
    //   name: "렌 경영대학",
    //   englishName: "ESC Rennes School of Business",
    //   region: "유럽권",
    //   country: "프랑스",
    //   homepageUrl: "https://www.rennes-sb.com/programmes/exchange-programme/",
    //   studentCapacity: 2,
    //   tuitionFeeType: "본교등록금납부형",
    //   gpaRequirement: null,
    //   semesterRequirement: "120ECTS 이상 이수해야 함\n(비고란 참조)",
    //   languageRequirements: { ibt: "72", itp: "543", toeic: "785", ielts: "5.5" },
    //   formatName: "esc_rennes_school_of_business",
    // },
    // {
    //   id: 98,
    //   name: "르아브르대학",
    //   englishName: "University of Le Havre",
    //   region: "유럽권",
    //   country: "프랑스",
    //   homepageUrl: "https://www.univ-lehavre.fr",
    //   studentCapacity: 3,
    //   tuitionFeeType: "본교등록금납부형",
    //   gpaRequirement: null,
    //   semesterRequirement: "2",
    //   languageRequirements: { ibt: "72", itp: "543", toeic: "785", ielts: "5.5" },
    //   formatName: "university_of_le_havre",
    // },
    // {
    //   id: 99,
    //   name: "릴 가톨릭 대학",
    //   englishName: "Lille Catholic University",
    //   region: "유럽권",
    //   country: "프랑스",
    //   homepageUrl: "http://www.univ-catholille.fr/",
    //   studentCapacity: 5,
    //   tuitionFeeType: "본교등록금납부형",
    //   gpaRequirement: "2.75",
    //   semesterRequirement: "2",
    //   languageRequirements: { ibt: "72", itp: "543", toeic: "785", ielts: "5.5" },
    //   formatName: "lille_catholic_university",
    // },
  ];

  const tabs = ["스크랩 한 글", "멘토", "위시학교"];
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
            return <PostCards posts={posts} />;
          case tabs[1]:
            return <></>;
          case tabs[2]:
            return <CollegeCards colleges={colleges} style={{ marginTop: "20px" }} />;
          default:
            return null; // 기본값으로 null 반환을 추가하는 것이 좋습니다.
        }
      })()}
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
