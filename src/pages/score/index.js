import { useState, useEffect } from "react";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Tab from "@/components/ui/tab";
import ScoreSheets from "@/components/score/score-sheets";
import ButtonTab from "@/components/ui/button-tab";
import ScoreSearchBar from "@/components/score/score-search-bar";
import ScoreSearchField from "@/components/score/score-search-field";
import ScoreUniversityRecommend from "@/components/score/score-university-recommend";

export default function ScorePage() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tempText, setTempText] = useState("하와이 대학교");

  function handleSearchBar(event) {
    event.preventDefault();

    // 임시
    // console.log(searchText);
    setTempText(searchText);

    setSearchActive(false);
  }
  function handleSearchField(keyWord) {
    setSearchText(keyWord);

    // 임시
    // console.log(keyWord);
    setTempText(keyWord);

    setSearchActive(false);
  }

  function handleSearchClick() {
    setSearchActive(true);
  }
  const keyWords = ["하와이", "보라스", "릴카톨릭", "파리8", "낭트", "헐", "함부르크", "오스트라바"];

  const [preference, setPreference] = useState("1순위");
  const tabChoice = ["1순위", "2순위"];

  const [filter, setFilter] = useState("");
  const filterChoice = ["유럽권", "미주권", "아시아권", "학점높은 순", "어학성적 높은 순"];

  const scoreSheets = [
    {
      key: 1,
      college: "하와이 대학교",
      scores: [
        {
          key: 1,
          name: "김솔커",
          score: 4.5,
          languageType: "토익",
          languageScore: 800,
        },
        {
          key: 2,
          name: "김솔커123",
          score: 4.3,
          languageType: "토익",
          languageScore: 800,
        },
        {
          key: 3,
          name: "김솔커12345",
          score: 4.2,
          languageType: "토익",
          languageScore: 800,
        },
      ],
    },
    {
      key: 2,
      college: "보라스 대학교",
      scores: [
        {
          key: 1,
          name: "김솔커",
          score: 4.5,
          languageType: "토익",
          languageScore: 800,
        },
        {
          key: 2,
          name: "김솔커",
          score: 4.3,
          languageType: "토익",
          languageScore: 800,
        },
        {
          key: 3,
          name: "김솔커",
          score: 4.2,
          languageType: "토익",
          languageScore: 800,
        },
      ],
    },
    {
      key: 3,
      college: "하와이 대학교",
      scores: [
        {
          key: 1,
          name: "김솔커",
          score: 4.5,
          languageType: "토익",
          languageScore: 800,
        },
        {
          key: 2,
          name: "김솔커",
          score: 4.3,
          languageType: "토익",
          languageScore: 800,
        },
        {
          key: 3,
          name: "김솔커",
          score: 4.2,
          languageType: "토익",
          languageScore: 800,
        },
      ],
    },
  ];

  if (searchActive) {
    return (
      <>
        <TopDetailNavigation title="점수 공유 현황" />
        <ScoreSearchBar text={searchText} setText={setSearchText} searchHandler={handleSearchBar} />
        <ScoreSearchField setText={setSearchText} keyWords={keyWords} searchHandler={handleSearchField} />
      </>
    );
  }

  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <ScoreSearchBar onClick={handleSearchClick} text={searchText} setText={setSearchText} searchHandler={handleSearchBar} />
      <Tab choices={tabChoice} choice={preference} setChoice={setPreference} />
      <ButtonTab choices={filterChoice} choice={filter} setChoice={setFilter} color={{ activeBtn: "#6f90d1", deactiveBtn: "#fff", activeBtnFont: "#fff", deactiveBtnFont: "#000", background: "#fafafa" }} style={{ padding: "10px 0 10px 18px" }} />
      <ScoreSheets sheets={scoreSheets} />
      {/* <ScoreUniversityRecommend text={tempText} /> */}
    </>
  );
}

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const { accessToken } = req.cookies;

  // 토큰 유효성 검사 로직 (예제 코드)
  const isLogin = !!accessToken;

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
