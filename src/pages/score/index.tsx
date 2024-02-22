import { useState, useEffect } from "react";
import createApiClient from "@/lib/serverApiClient";
import { ScoreSheet } from "@/types/application";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Tab from "@/components/ui/tab";
import ScoreSheets from "@/components/score/score-sheets";
import ButtonTab from "@/components/ui/button-tab";
import ScoreSearchBar from "@/components/score/score-search-bar";
import ScoreSearchField from "@/components/score/score-search-field";

interface ScoreData {
  firstChoice: ScoreSheet[];
  secondChoice: ScoreSheet[];
}

export default function ScorePage({ status, scoreData }: { status: string; scoreData: ScoreData }) {
  if (status === "NOT_SUBMITTED") {
    return <div>점수 공유 현황을 보려면 점수를 제출해주세요.</div>;
  } else if (status === "SUBMITTED_PENDING") {
    return <div>점수 공유 현황을 보려면 점수가 승인되어야 합니다.</div>;
  } else if (status === "SUBMITTED_REJECTED") {
    return <div>점수 공유 현황을 보려면 점수가 승인되어야 합니다.</div>;
  }
  console.log(scoreData);

  // 검색
  const [searchActive, setSearchActive] = useState<boolean>(false); // 검색 창 활성화 여부
  const [searchText, setSearchText] = useState<string>(""); // 검색 키워드 텍스트

  function handleSearchBar(event) {
    event.preventDefault();
    setSearchActive(false);
  }
  function handleSearchField(keyWord) {
    setSearchText(keyWord);
    setSearchActive(false);
  }

  function handleSearchClick() {
    setSearchActive(true);
  }
  const keyWords = ["하와이", "보라스", "릴카톨릭", "파리8", "낭트", "헐", "함부르크", "오스트라바"];

  // 점수 데이터
  const preferenceChoice: string[] = ["1순위", "2순위"];
  const [preference, setPreference] = useState<string>("1순위");

  // const filterChoice: string[] = ["유럽권", "미주권", "아시아권", "학점높은 순", "어학성적 높은 순"];
  const filterChoice: string[] = ["유럽권", "미주권", "아시아권", "중국권"];
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (filter === "유럽권") {
      setFilteredScoreData({
        firstChoice: scoreData.firstChoice.filter((sheet) => sheet.region === "유럽권"),
        secondChoice: scoreData.secondChoice.filter((sheet) => sheet.region === "유럽권"),
      });
    } else if (filter === "미주권") {
      setFilteredScoreData({
        firstChoice: scoreData.firstChoice.filter((sheet) => sheet.region === "미주권"),
        secondChoice: scoreData.secondChoice.filter((sheet) => sheet.region === "미주권"),
      });
    } else if (filter === "아시아권") {
      setFilteredScoreData({
        firstChoice: scoreData.firstChoice.filter((sheet) => sheet.region === "아시아권"),
        secondChoice: scoreData.secondChoice.filter((sheet) => sheet.region === "아시아권"),
      });
    } else if (filter === "중국권") {
      setFilteredScoreData({
        firstChoice: scoreData.firstChoice.filter((sheet) => sheet.region === "중국권"),
        secondChoice: scoreData.secondChoice.filter((sheet) => sheet.region === "중국권"),
      });
    } else {
      setFilteredScoreData(scoreData);
    }
  }, [filter]);

  const [filteredScoreData, setFilteredScoreData] = useState<ScoreData>(scoreData);

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
      <Tab choices={preferenceChoice} choice={preference} setChoice={setPreference} />
      <ButtonTab choices={filterChoice} choice={filter} setChoice={setFilter} color={{ activeBtn: "#6f90d1", deactiveBtn: "#fff", activeBtnFont: "#fff", deactiveBtnFont: "#000", background: "#fafafa" }} style={{ padding: "10px 0 10px 18px" }} />
      <ScoreSheets scoreSheets={preference === "1순위" ? filteredScoreData.firstChoice : filteredScoreData.secondChoice} />
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
    } else if (statusData.status === "SUBMITTED_PENDING") {
      return {
        props: {
          status: "SUBMITTED_PENDING",
        },
      };
    } else if (statusData.status === "SUBMITTED_REJECTED") {
      return {
        props: {
          status: "SUBMITTED_REJECTED",
        },
      };
    } else if (statusData.status === "SUBMITTED_APPROVED" || statusData.status === "SCORE_SUBMITTED") {
      const scoreResponse = await serverApiClient.get("/application");
      const scoreData = scoreResponse.data.data;
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
