import { useState, useEffect, useRef } from "react";
import { FORBIDDEN_APPLY_STATUS, ScoreSheet } from "@/types/application";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Tab from "@/components/ui/tab";
import ScoreSheets from "@/components/score/score-sheets";
import ButtonTab from "@/components/ui/button-tab";
import ScoreSearchBar from "@/components/score/score-search-bar";
import ScoreSearchField from "@/components/score/score-search-field";
import { useGetApplicationList, useGetMyApplicationStatus } from "@/services/application";
import { REGIONS_KO } from "@/constants/university";
import { RegionsKo } from "@/types/college";

interface ScoreData {
  firstChoice: ScoreSheet[];
  secondChoice: ScoreSheet[];
}

const HOT_KEYWORDS = ["RMIT", "오스트라바", "칼스루에", "그라츠", "추오", "프라하", "보라스", "빈", "메모리얼"];

export default function ScorePage() {
  // const [loading, setLoading] = useState<boolean>(true);
  // const [status, setStatus] = useState<string>("");
  // 검색
  const [searchScreenActive, setSearchScreenActive] = useState<boolean>(false); // 검색 창 활성화 여부
  const searchRef = useRef<HTMLInputElement>(null);
  // 점수 데이터
  const [filteredScoreData, setFilteredScoreData] = useState<ScoreData>({ firstChoice: [], secondChoice: [] });
  const PREFERENCE_CHOICE: string[] = ["1순위", "2순위"];
  const [preference, setPreference] = useState<"1순위" | "2순위">("1순위");
  const [regionFilter, setRegionFilter] = useState<RegionsKo | "">("");

  const [status, statusError, statusLoading] = useGetMyApplicationStatus();

  const [score, scoreError, scoreLoading] = useGetApplicationList();

  useEffect(() => {
    if (scoreLoading) return;
    if (regionFilter === "유럽권") {
      setFilteredScoreData({
        firstChoice: score.data.firstChoice.filter((sheet) => sheet.region === "유럽권"),
        secondChoice: score.data.secondChoice.filter((sheet) => sheet.region === "유럽권"),
      });
    } else if (regionFilter === "미주권") {
      setFilteredScoreData({
        firstChoice: score.data.firstChoice.filter((sheet) => sheet.region === "미주권"),
        secondChoice: score.data.secondChoice.filter((sheet) => sheet.region === "미주권"),
      });
    } else if (regionFilter === "아시아권") {
      setFilteredScoreData({
        firstChoice: score.data.firstChoice.filter((sheet) => sheet.region === "아시아권"),
        secondChoice: score.data.secondChoice.filter((sheet) => sheet.region === "아시아권"),
      });
    } else if (regionFilter === "중국권") {
      setFilteredScoreData({
        firstChoice: score.data.firstChoice.filter((sheet) => sheet.region === "중국권"),
        secondChoice: score.data.secondChoice.filter((sheet) => sheet.region === "중국권"),
      });
    } else {
      setFilteredScoreData(score.data);
    }
  }, [regionFilter, scoreLoading]);

  function handleSearch(event) {
    event.preventDefault();
    const keyWord = searchRef.current.value;
    setRegionFilter("");
    setFilteredScoreData(
      keyWord
        ? {
            firstChoice: score.data.firstChoice.filter((sheet) => sheet.koreanName.includes(keyWord)),
            secondChoice: score.data.secondChoice.filter((sheet) => sheet.koreanName.includes(keyWord)),
          }
        : score.data
    );
    setSearchScreenActive(false);
  }
  const handleSearchField = (keyWord: string) => {
    searchRef.current.value = keyWord;
  };

  const handleSearchClick = () => {
    setSearchScreenActive(true);
  };

  if (statusLoading) return <div>Loading...</div>;
  if (status.data.status === "NO_AUTHORIZATION") {
    return <div>점수 공유 현황을 보려면 로그인이 필요합니다.</div>;
  } else if (status.data.status === "NOT_SUBMITTED") {
    return <div>점수 공유 현황을 보려면 점수를 제출해주세요.</div>;
  } else if (status.data.status === "COLLEGE_SUBMITTED") {
    return <div>점수 공유 현황을 보려면 점수를 인증해야 합니다.</div>;
  } else if (status.data.status === "SCORE_SUBMITTED") {
    return <div>점수 공유 현황을 보려면 지원 대학을 추가해야 합니다.</div>;
  } else if (status.data.status === "SUBMITTED_PENDING") {
    return <div>점수 공유 현황을 보려면 점수가 승인되어야 합니다.</div>;
  } else if (status.data.status === "SUBMITTED_REJECTED") {
    return <div>점수 인증이 거절되었습니다. 점수 공유 현황을 확인을 위해 다시 제출해 주세요.</div>;
  }

  if (!scoreLoading) {
    score.data.firstChoice.sort((a, b) => b.applicants.length - a.applicants.length);
    score.data.secondChoice.sort((a, b) => b.applicants.length - a.applicants.length);
  }

  if (!searchScreenActive) {
    return (
      <>
        <TopDetailNavigation title="점수 공유 현황" />
        <ScoreSearchBar onClick={handleSearchClick} textRef={searchRef} searchHandler={handleSearch} />
        <Tab choices={PREFERENCE_CHOICE} choice={preference} setChoice={setPreference} />
        <ButtonTab
          choices={REGIONS_KO}
          choice={regionFilter}
          setChoice={setRegionFilter}
          color={{ activeBtn: "#6f90d1", deactiveBtn: "#fff", activeBtnFont: "#fff", deactiveBtnFont: "#000", background: "#fafafa" }}
          style={{ padding: "10px 0 10px 18px" }}
        />
        <ScoreSheets scoreSheets={preference === "1순위" ? filteredScoreData.firstChoice : filteredScoreData.secondChoice} />
      </>
    );
  }
  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <ScoreSearchBar textRef={searchRef} searchHandler={handleSearch} />
      <ScoreSearchField searchRef={searchRef} keyWords={HOT_KEYWORDS} setKeyWord={handleSearchField} />
    </>
  );
}
