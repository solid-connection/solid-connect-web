"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
import { toast } from "@/lib/zustand/useToastStore";

const PREFERENCE_CHOICE: ("1순위" | "2순위" | "3순위")[] = ["1순위", "2순위", "3순위"];

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

  const initialData: ScoreData = {
    firstChoice: [],
    secondChoice: [],
    thirdChoice: [],
  };

  const {
    data: scoreResponseData = initialData,
    isError,
    isLoading,
  } = useGetApplicationsList({
    retry: false,
  });

  const filteredAndSortedData = useMemo(() => {
    // ✨ 1. 대학 이름(koreanName)을 기준으로 중복을 제거하는 헬퍼 함수
    const uniqueByKoreanName = (data: ScoreSheetType[]) => {
      // Map을 사용해 koreanName을 키로 하여 중복을 효율적으로 제거합니다.
      const universityMap = new Map(data.map((sheet) => [sheet.koreanName, sheet]));
      // Map의 값들만 다시 배열로 변환하여 반환합니다.
      return Array.from(universityMap.values());
    };

    // ✨ 2. API 응답 데이터를 받자마자 중복부터 제거합니다.
    const firstChoice = uniqueByKoreanName(scoreResponseData?.firstChoice || []);
    const secondChoice = uniqueByKoreanName(scoreResponseData?.secondChoice || []);
    const thirdChoice = uniqueByKoreanName(scoreResponseData?.thirdChoice || []);

    // 3. 중복이 제거된 데이터를 정렬합니다.
    const sortedData = {
      firstChoice: [...firstChoice].sort((a, b) => b.applicants.length - a.applicants.length),
      secondChoice: [...secondChoice].sort((a, b) => b.applicants.length - a.applicants.length),
      thirdChoice: [...thirdChoice].sort((a, b) => b.applicants.length - a.applicants.length),
    };

    // 4. 기존 필터링 로직을 적용합니다.
    const applyFilters = (data: ScoreSheetType[]) => {
      let result = data;
      if (regionFilter) {
        result = result.filter((sheet) => sheet.region === regionFilter);
      }
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

  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      toast.error("지원 현황을 불러오는 중에 오류가 발생했습니다. 지원 절차를 진행해주세요.");
      router.replace("/university/application/apply");
    }
  }, [isError, isLoading, router]);

  const hotKeyWords = ["RMIT", "오스트라바", "칼스루에", "그라츠", "추오", "프라하", "보라스", "빈", "메모리얼"];

  return (
    <div className="gap-4 px-5">
      <ScoreSearchBar onClick={handleSearchClick} textRef={searchRef} searchHandler={handleSearch} />

      {searchActive ? (
        <div className="p-4 font-sans">
          {/* Title for the popular searches section */}
          <div className="ml-5 mt-[18px] text-black typo-sb-7">인기 검색</div>

          {/* Container for the keyword buttons */}
          <div className="ml-5 mt-2.5 flex flex-wrap gap-2">
            {hotKeyWords.map((word) => (
              <button
                key={word}
                // Button styling for each keyword
                className="flex items-center justify-center gap-2.5 rounded-full bg-gray-50 px-3 py-[5px] text-black transition-colors typo-medium-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={() => {
                  handleSearchField(word);
                  handleSearch(new Event("submit") as unknown as React.FormEvent);
                }}
                type="button"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
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

          <div className="mx-auto mt-2.5 flex w-full flex-col gap-3 overflow-x-auto">
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
        </>
      )}
    </div>
  );
};

export default ScorePageContent;
