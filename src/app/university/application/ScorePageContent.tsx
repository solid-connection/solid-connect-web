"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import ConfirmCancelModal from "@/components/modal/ConfirmCancelModal";
import ButtonTab from "@/components/ui/ButtonTab";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import Tab from "@/components/ui/Tab";

import ScoreSearchBar from "./ScoreSearchBar";
import ScoreSearchField from "./ScoreSearchField";
import ScoreSheet from "./ScoreSheet";

import { REGIONS_KO } from "@/constants/university";
import { ScoreSheet as ScoreSheetType } from "@/types/application";
import { RegionKo } from "@/types/university";

import useGetApplicationsList from "@/api/applications/client/useGetApplicationsList";

const PREFERENCE_CHOICE: ("1순위" | "2순위" | "3순위")[] = ["1순위", "2순위", "3순위"];

// API 응답 데이터의 타입을 명확하게 정의합니다.
// 실제 ApplicationListResponse 타입을 사용하시는 것이 더 좋습니다.
interface ScoreData {
  firstChoice: ScoreSheetType[];
  secondChoice: ScoreSheetType[];
  thirdChoice: ScoreSheetType[];
}

const ScorePageContent = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchActive, setSearchActive] = useState(false);
  const [preference, setPreference] = useState<"1순위" | "2순위" | "3순위">("1순위");
  const [regionFilter, setRegionFilter] = useState<RegionKo | "">("");
  const [searchValue, setSearchValue] = useState("");
  const [showNeedApply, setShowNeedApply] = useState(false);

  // ✨ 1. 초기 데이터를 API 응답 구조와 동일하게 설정합니다.
  const initialData: ScoreData = {
    firstChoice: [],
    secondChoice: [],
    thirdChoice: [],
  };

  // ✨ 2. `data`의 기본값을 위에서 정의한 initialData로 변경합니다.
  const { data: scoreResponseData = initialData, isLoading } = useGetApplicationsList();

  const filteredAndSortedData = useMemo(() => {
    // 데이터가 없는 경우를 대비한 방어 코드
    const firstChoice = scoreResponseData?.firstChoice || [];
    const secondChoice = scoreResponseData?.secondChoice || [];
    const thirdChoice = scoreResponseData?.thirdChoice || [];

    // 원본 데이터를 훼손하지 않기 위해 복사본을 만들어 정렬합니다.
    const sortedData = {
      // ✨ 3. `[...scoreResponseData]`가 아니라 `[...firstChoice]`로 수정합니다.
      firstChoice: [...firstChoice].sort((a, b) => b.applicants.length - a.applicants.length),
      secondChoice: [...secondChoice].sort((a, b) => b.applicants.length - a.applicants.length),
      thirdChoice: [...thirdChoice].sort((a, b) => b.applicants.length - a.applicants.length),
    };

    // 필터링 로직
    const applyFilters = (data: ScoreSheetType[]) => {
      let result = data;
      // 지역 필터
      if (regionFilter) {
        result = result.filter((sheet) => sheet.region === regionFilter);
      }
      // 검색어 필터
      if (searchValue) {
        result = result.filter((sheet) => sheet.koreanName.toLowerCase().includes(searchValue.toLowerCase()));
      }
      return result;
    };

    return {
      firstChoice: applyFilters(sortedData.firstChoice),
      secondChoice: applyFilters(sortedData.secondChoice),
      thirdChoice: applyFilters(sortedData.thirdChoice),
    };
  }, [scoreResponseData, regionFilter, searchValue]);

  // (이하 코드는 동일)
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const keyword = searchRef.current?.value || "";
    setRegionFilter("");
    setSearchValue(keyword);
    setSearchActive(false);
  };

  const handleSearchField = (keyword: string) => {
    if (searchRef.current) {
      searchRef.current.value = keyword;
    }
  };

  const handleSearchClick = () => {
    setSearchActive(true);
  };

  const getScoreSheet = () => {
    switch (preference) {
      case "1순위":
        return filteredAndSortedData.firstChoice;
      case "2순위":
        return filteredAndSortedData.secondChoice;
      case "3순위":
        return filteredAndSortedData.thirdChoice;
      default:
        return [];
    }
  };
  const scoreSheets = getScoreSheet();

  if (isLoading) {
    return <CloudSpinnerPage />;
  }

  if (searchActive) {
    const hotKeyWords = ["RMIT", "오스트라바", "칼스루에", "그라츠", "추오", "프라하", "보라스", "빈", "메모리얼"];
    return (
      <>
        <ScoreSearchBar textRef={searchRef} searchHandler={handleSearch} onClick={() => setSearchActive(false)} />
        <ScoreSearchField keyWords={hotKeyWords} setKeyWord={handleSearchField} />
      </>
    );
  }

  return (
    <div className="gap-4 px-5">
      <ScoreSearchBar onClick={handleSearchClick} textRef={searchRef} searchHandler={handleSearch} />
      <Tab choices={PREFERENCE_CHOICE} choice={preference} setChoice={setPreference} />
      <ButtonTab
        choices={REGIONS_KO}
        choice={regionFilter}
        setChoice={(newRegion) => {
          if (searchRef.current) searchRef.current.value = "";
          setSearchValue("");
          setRegionFilter(newRegion as RegionKo | "");
        }}
        style={{ padding: "10px 0 10px 18px" }}
      />

      <div className="mx-5 mt-2.5 flex w-[calc(100%-44px)] flex-col gap-3 overflow-x-auto">
        {scoreSheets.map((choice) => (
          <ScoreSheet key={choice.koreanName} scoreSheet={choice} />
        ))}
      </div>
      <ConfirmCancelModal
        title="학교 지원이 필요합니다"
        isOpen={showNeedApply}
        handleCancel={() => router.push("/")}
        handleConfirm={() => router.push("/university/application/apply")}
        content={"점수 공유현황을 확인하려면 지원절차를\n진행해주세요."}
        cancelText="확인"
        approveText="학교 지원하기"
      />
    </div>
  );
};

export default ScorePageContent;
