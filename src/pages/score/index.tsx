import { useState, useEffect, useRef } from "react";
import { ScoreSheet } from "@/types/application";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Tab from "@/components/ui/tab";
import ScoreSheets from "@/components/score/score-sheets";
import ButtonTab from "@/components/ui/button-tab";
import ScoreSearchBar from "@/components/score/score-search-bar";
import ScoreSearchField from "@/components/score/score-search-field";
import { getApplicationListApi, getMyApplicationStatusApi } from "@/services/application";
import { REGIONS_KO } from "@/constants/university";
import { RegionKo } from "@/types/university";

interface ScoreData {
  firstChoice: ScoreSheet[];
  secondChoice: ScoreSheet[];
}

const PREFERENCE_CHOICE: string[] = ["1순위", "2순위"];

export default function ScorePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  // 검색
  const [searchActive, setSearchActive] = useState<boolean>(false); // 검색 창 활성화 여부
  const searchRef = useRef<HTMLInputElement>(null);
  // 점수 데이터
  const [scoreData, setScoreData] = useState<ScoreData>({ firstChoice: [], secondChoice: [] });
  const [filteredScoreData, setFilteredScoreData] = useState<ScoreData>(scoreData);
  const [preference, setPreference] = useState<"1순위" | "2순위">("1순위");
  const [filter, setFilter] = useState<RegionKo | "">("");

  useEffect(() => {
    async function fetchData() {
      try {
        const statusResponse = await getMyApplicationStatusApi();

        const statusData = statusResponse.data;
        setStatus(statusData.status);

        if (statusData.status === "SUBMITTED_APPROVED") {
          const scoreResponse = await getApplicationListApi();

          const scoreData = scoreResponse.data;
          setScoreData(scoreData);
          setFilteredScoreData(scoreData);
        }
      } catch (err) {
        if (err.response) {
          console.error(err.response.data);
          alert(err.response.data);
        } else if (err.reqeust) {
          console.error(err.request);
        } else {
          console.error(err.message);
          alert(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  scoreData.firstChoice.sort((a, b) => b.applicants.length - a.applicants.length);
  scoreData.secondChoice.sort((a, b) => b.applicants.length - a.applicants.length);

  function handleSearch(event) {
    event.preventDefault();
    const keyWord = searchRef.current.value;
    setFilter("");
    setFilteredScoreData(
      keyWord
        ? {
            firstChoice: scoreData.firstChoice.filter((sheet) => sheet.koreanName.includes(keyWord)),
            secondChoice: scoreData.secondChoice.filter((sheet) => sheet.koreanName.includes(keyWord)),
          }
        : scoreData
    );
    setSearchActive(false);
  }

  function handleSearchField(keyWord) {
    searchRef.current.value = keyWord;
  }

  function handleSearchClick() {
    setSearchActive(true);
  }
  const hotKeyWords = ["RMIT", "오스트라바", "칼스루에", "그라츠", "추오", "프라하", "보라스", "빈", "메모리얼"];

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (status === "NO_AUTHORIZATION") {
    return <div>점수 공유 현황을 보려면 로그인이 필요합니다.</div>;
  } else if (status === "NOT_SUBMITTED") {
    return <div>점수 공유 현황을 보려면 점수를 제출해주세요.</div>;
  } else if (status === "COLLEGE_SUBMITTED") {
    return <div>점수 공유 현황을 보려면 점수를 인증해야 합니다.</div>;
  } else if (status === "SCORE_SUBMITTED") {
    return <div>점수 공유 현황을 보려면 지원 대학을 추가해야 합니다.</div>;
  } else if (status === "SUBMITTED_PENDING") {
    return <div>점수 공유 현황을 보려면 점수가 승인되어야 합니다.</div>;
  } else if (status === "SUBMITTED_REJECTED") {
    return <div>점수 인증이 거절되었습니다. 점수 공유 현황을 확인을 위해 다시 제출해 주세요.</div>;
  }

  if (searchActive) {
    return (
      <>
        <TopDetailNavigation title="점수 공유 현황" />
        <ScoreSearchBar textRef={searchRef} searchHandler={handleSearch} />
        <ScoreSearchField searchRef={searchRef} keyWords={hotKeyWords} setKeyWord={handleSearchField} />
      </>
    );
  }

  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <ScoreSearchBar onClick={handleSearchClick} textRef={searchRef} searchHandler={handleSearch} />
      <Tab choices={PREFERENCE_CHOICE} choice={preference} setChoice={setPreference} />
      <ButtonTab choices={REGIONS_KO} choice={filter} setChoice={setFilter} color={{ activeBtn: "#6f90d1", deactiveBtn: "#fff", activeBtnFont: "#fff", deactiveBtnFont: "#000", background: "#fafafa" }} style={{ padding: "10px 0 10px 18px" }} />
      <ScoreSheets scoreSheets={preference === "1순위" ? filteredScoreData.firstChoice : filteredScoreData.secondChoice} />
    </>
  );
}
