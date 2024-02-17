import { useState, useEffect } from "react";
import createApiClient from "@/lib/serverApiClient";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Tab from "@/components/ui/tab";
import ScoreSheets from "@/components/score/score-sheets";
import ButtonTab from "@/components/ui/button-tab";
import ScoreSearchBar from "@/components/score/score-search-bar";
import ScoreSearchField from "@/components/score/score-search-field";

interface ScoreData {
  firstChoice: Choice[];
  secondChoice: Choice[];
}

interface Choice {
  koreanName: string;
  studentCapacity: number;
  applicants: Applicant[];
}

interface Applicant {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export default function ScorePage({ status, scoreData }: { status: string; scoreData: ScoreData }) {
  // 검색
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

  // 점수 데이터
  const [preference, setPreference] = useState("1순위");
  const tabChoice = ["1순위", "2순위"];

  const [filter, setFilter] = useState("");
  const filterChoice = ["유럽권", "미주권", "아시아권", "학점높은 순", "어학성적 높은 순"];

  const [fileredScoreData, setFilteredScoreData] = useState<ScoreData>(scoreData);

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
      <ScoreSheets data={preference === "1순위" ? fileredScoreData.firstChoice : fileredScoreData.secondChoice} />
      {/* <ScoreUniversityRecommend text={tempText} /> */}
    </>
  );
}

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req, res } = context;
  const serverApiClient = createApiClient(req, res);

  try {
    // 서버에서 데이터를 가져옵니다.
    const statusResponse = await serverApiClient.get("/application/status");
    const statusData = statusResponse.data.data;
    if (statusData.status === "NOT_SUBMITTED") {
      return {
        props: {
          status: "NOT_SUBMITTED",
        },
      };
    } else if (statusData.status === "SUBMITTED_NOT_APPROVED") {
      return {
        props: {
          status: "SUBMITTED_NOT_APPROVED",
        },
      };
    } else if (statusData.status === "SUBMITTED_APPROVED") {
      const scoreResponse = await serverApiClient.get("/application");
      const scoreData = scoreResponse.data.data;
      console.log(scoreData);
      return {
        props: {
          status: "SUBMITTED_APPROVED",
          scoreData: scoreData,
        },
      };
    }
    return {
      props: {
        status: "NO_AUTHORIZATION",
      },
    };
  } catch (error) {
    // 에러가 발생하면 빈 props를 반환합니다.
    return {
      props: {
        status: "NO_AUTHORIZATION",
      },
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
