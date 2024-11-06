"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getApplicationListApi, getMyApplicationStatusApi } from "@/services/application";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/loading/CloudSpinnerPage";
import CertFinalScreen from "@/components/score/register/cert-final-screen";
import CollegeFinalScreen from "@/components/score/register/college-final-screen";
import ButtonTab from "@/components/ui/button-tab";
import Tab from "@/components/ui/tab";

import ScoreSearchBar from "./ScoreSearchBar";
import ScoreSearchField from "./ScoreSearchField";
import ScoreSheets from "./ScoreSheets";

import { REGIONS_KO } from "@/constants/university";
import { ApplicationListResponse } from "@/types/application";
import { RegionKo } from "@/types/university";

const PREFERENCE_CHOICE: string[] = ["1순위", "2순위", "3순위"];

const ScorePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  // 검색
  const [searchActive, setSearchActive] = useState<boolean>(false); // 검색 창 활성화 여부
  const searchRef = useRef<HTMLInputElement>(null);
  // 점수 데이터
  const [scoreData, setScoreData] = useState<ApplicationListResponse>({
    firstChoice: [],
    secondChoice: [],
    thirdChoice: [],
  });
  const [filteredScoreData, setFilteredScoreData] = useState<ApplicationListResponse>({
    firstChoice: [],
    secondChoice: [],
    thirdChoice: [],
  });
  const [preference, setPreference] = useState<"1순위" | "2순위" | "3순위">("1순위");
  const [filter, setFilter] = useState<RegionKo | "">("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusResponse = await getMyApplicationStatusApi();

        const statusData = statusResponse.data;
        setStatus(statusData.status);

        if (statusData.status === "SUBMITTED_APPROVED") {
          const scoreResponse = await getApplicationListApi();

          const scoreResponseData = scoreResponse.data;
          scoreResponseData.firstChoice.sort((a, b) => b.applicants.length - a.applicants.length);
          scoreResponseData.secondChoice.sort((a, b) => b.applicants.length - a.applicants.length);
          scoreResponseData.thirdChoice.sort((a, b) => b.applicants.length - a.applicants.length);
          setScoreData(scoreResponseData);
          setFilteredScoreData(scoreResponseData);
        }
      } catch (err: any) {
        if (err.response) {
          console.error("Axios response error", err.response);
          if (err.response.status === 401 || err.response.status === 403) {
            alert("로그인이 필요합니다");
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const keyWord = searchRef.current?.value || "";
    setFilter("");
    setFilteredScoreData(
      keyWord
        ? {
            firstChoice: scoreData.firstChoice.filter((sheet) => sheet.koreanName.includes(keyWord)),
            secondChoice: scoreData.secondChoice.filter((sheet) => sheet.koreanName.includes(keyWord)),
            thirdChoice: scoreData.thirdChoice.filter((sheet) => sheet.koreanName.includes(keyWord)),
          }
        : scoreData,
    );
    setSearchActive(false);
  };

  const handleSearchField = (keyWord: string) => {
    if (searchRef.current) {
      searchRef.current.value = keyWord;
    }
  };

  const handleSearchClick = () => {
    setSearchActive(true);
  };

  const hotKeyWords = ["RMIT", "오스트라바", "칼스루에", "그라츠", "추오", "프라하", "보라스", "빈", "메모리얼"];

  useEffect(() => {
    if (filter) {
      setFilteredScoreData({
        firstChoice: scoreData.firstChoice.filter((sheet) => sheet.region === filter),
        secondChoice: scoreData.secondChoice.filter((sheet) => sheet.region === filter),
        thirdChoice: scoreData.thirdChoice.filter((sheet) => sheet.region === filter),
      });
    } else {
      setFilteredScoreData(scoreData);
    }
  }, [filter, scoreData]);

  if (loading) {
    return <CloudSpinnerPage />;
  }

  if (status === "NO_AUTHORIZATION") {
    return <div>점수 공유 현황을 보려면 로그인이 필요합니다.</div>;
  }
  if (status === "NOT_SUBMITTED") {
    router.push("/score/register");
    return <div>점수 공유 현황을 보려면 점수를 제출해주세요.</div>;
  }
  if (status === "COLLEGE_SUBMITTED") {
    return <div>점수 공유 현황을 보려면 점수를 인증해야 합니다.</div>;
  }
  if (status === "SCORE_SUBMITTED") {
    return (
      <div style={{ height: "calc(100vh - 112px)", display: "flex", flexDirection: "column" }}>
        <CertFinalScreen />
      </div>
    );
  }
  if (status === "SUBMITTED_PENDING") {
    return (
      <div style={{ height: "calc(100vh - 112px)", display: "flex", flexDirection: "column" }}>
        <CollegeFinalScreen />
      </div>
    );
  }
  if (status === "SUBMITTED_REJECTED") {
    return <div>점수 인증이 거절되었습니다. 점수 공유 현황을 확인을 위해 다시 제출해 주세요.</div>;
  }

  const getScoreSheet = () => {
    if (preference === "1순위") {
      return filteredScoreData.firstChoice;
    }
    if (preference === "2순위") {
      return filteredScoreData.secondChoice;
    }
    if (preference === "3순위") {
      return filteredScoreData.thirdChoice;
    }
    return [];
  };

  if (searchActive) {
    return (
      <>
        <TopDetailNavigation title="점수 공유 현황" />
        <ScoreSearchBar textRef={searchRef} searchHandler={handleSearch} onClick={() => {}} />
        <ScoreSearchField
          keyWords={hotKeyWords}
          setKeyWord={(e) => {
            handleSearchField(e);
          }}
        />
      </>
    );
  }

  return (
    <>
      <TopDetailNavigation title="점수 공유 현황" />
      <ScoreSearchBar onClick={handleSearchClick} textRef={searchRef} searchHandler={handleSearch} />
      <Tab choices={PREFERENCE_CHOICE} choice={preference} setChoice={setPreference} />
      <ButtonTab
        choices={REGIONS_KO}
        choice={filter}
        setChoice={setFilter}
        color={{
          activeBtn: "#6f90d1",
          deactiveBtn: "#fff",
          activeBtnFont: "#fff",
          deactiveBtnFont: "#000",
          background: "#fafafa",
        }}
        style={{ padding: "10px 0 10px 18px" }}
      />
      <ScoreSheets scoreSheets={getScoreSheet()} />
    </>
  );
};

export default ScorePage;
