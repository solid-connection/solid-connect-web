"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ConfirmCancelModal from "@/components/modal/ConfirmCancelModal";
import ButtonTab from "@/components/ui/ButtonTab";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import Tab from "@/components/ui/Tab";

import ScoreSearchBar from "./ScoreSearchBar";
import ScoreSearchField from "./ScoreSearchField";
import ScoreSheets from "./ScoreSheets";

import { REGIONS_KO } from "@/constants/university";
import { ApplicationListResponse } from "@/types/application";
import { RegionKo } from "@/types/university";

import { getApplicationListApi, getCompetitorsApplicationListApi } from "@/api/application";

const PREFERENCE_CHOICE: string[] = ["1순위", "2순위", "3순위"];

const ScorePageContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
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

  const [showNeedApply, setShowNeedApply] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (true) {
          const scoreResponse = await getCompetitorsApplicationListApi();

          const scoreResponseData = scoreResponse.data;
          scoreResponseData.firstChoice.sort((a, b) => b.applicants.length - a.applicants.length);
          scoreResponseData.secondChoice.sort((a, b) => b.applicants.length - a.applicants.length);
          scoreResponseData.thirdChoice.sort((a, b) => b.applicants.length - a.applicants.length);
          setScoreData(scoreResponseData);
          setFilteredScoreData(scoreResponseData);
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setShowNeedApply(true);
          } else if (err.response.status === 401 || err.response.status === 403) {
            alert("로그인이 필요합니다");
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
        } else {
          console.error("Error", err.message);
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
      <ScoreSearchBar onClick={handleSearchClick} textRef={searchRef} searchHandler={handleSearch} />
      <Tab choices={PREFERENCE_CHOICE} choice={preference} setChoice={setPreference} />
      <ButtonTab choices={REGIONS_KO} choice={filter} setChoice={setFilter} style={{ padding: "10px 0 10px 18px" }} />
      <ScoreSheets scoreSheets={getScoreSheet()} />
      <ConfirmCancelModal
        isOpen={showNeedApply}
        handleCancel={() => {
          router.push("/");
        }}
        handleConfirm={() => {
          router.push("/application/apply");
        }}
        title=""
        content={"점수 공유현황을 확인하려면 지원절차를\n진행해주세요."}
        cancelText="확인"
        approveText="학교 지원하기"
      />
    </>
  );
};

export default ScorePageContent;
