"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useGetApplicationsList } from "@/apis/applications";
import ConfirmCancelModal from "@/components/modal/ConfirmCancelModal";
import ButtonTab from "@/components/ui/ButtonTab";
import Tab from "@/components/ui/Tab";
import { DEFAULT_MAX_CHOICE_COUNT, getHomeUniversityById, REGIONS_KO } from "@/constants/university";
import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ScoreSheet as ScoreSheetType } from "@/types/application";
import type { RegionKo } from "@/types/university";
import ApplicationSectionTitle from "./_components/ApplicationSectionTitle";
import ScoreSearchBar from "./ScoreSearchBar";
import ScoreSearchField from "./ScoreSearchField";
import ScoreSheet from "./ScoreSheet";

const ScorePageContent = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null!);
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);
  const maxChoiceCount = getHomeUniversityById(homeUniversityId)?.maxChoiceCount ?? DEFAULT_MAX_CHOICE_COUNT;

  const [searchActive, setSearchActive] = useState(false);
  const [preferenceIndex, setPreferenceIndex] = useState(0);
  const [regionFilter, setRegionFilter] = useState<RegionKo | "">("");
  const [searchValue, setSearchValue] = useState("");
  const [showNeedApply, _setShowNeedApply] = useState(false);

  const emptyChoices = useMemo(
    () => Array.from({ length: maxChoiceCount }, () => [] as ScoreSheetType[]),
    [maxChoiceCount],
  );
  const { data: scoreResponseData, isError, isLoading } = useGetApplicationsList();
  const scoreChoices = scoreResponseData?.choices ?? emptyChoices;
  const preferenceChoices = useMemo(
    () => Array.from({ length: Math.max(scoreChoices.length, maxChoiceCount) }, (_, index) => `${index + 1}순위`),
    [maxChoiceCount, scoreChoices.length],
  );

  const filteredAndSortedData = useMemo(() => {
    // ✨ 1. 대학 이름(koreanName)을 기준으로 중복을 제거하는 헬퍼 함수
    const uniqueByKoreanName = (data: ScoreSheetType[]) => {
      // Map을 사용해 koreanName을 키로 하여 중복을 효율적으로 제거합니다.
      const universityMap = new Map(data.map((sheet) => [sheet.koreanName, sheet]));
      // Map의 값들만 다시 배열로 변환하여 반환합니다.
      return Array.from(universityMap.values());
    };

    // ✨ 2. API 응답 데이터를 받자마자 중복부터 제거하고 정렬합니다.
    const sortedData = scoreChoices.map((choice) =>
      uniqueByKoreanName(choice).sort((a, b) => b.applicants.length - a.applicants.length),
    );

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

    return sortedData.map(applyFilters);
  }, [scoreChoices, regionFilter, searchValue]);

  // (이하 코드는 동일)
  const handleSearch = (event: FormEvent) => {
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
    setRegionFilter("");
    setSearchValue(keyword);
    setSearchActive(false);
  };

  const handleSearchClick = () => {
    setSearchActive(true);
  };

  const handlePreferenceChange = (nextPreference: string) => {
    const nextIndex = preferenceChoices.indexOf(nextPreference);
    setPreferenceIndex(nextIndex >= 0 ? nextIndex : 0);
  };

  const selectedPreference = preferenceChoices[preferenceIndex] ?? preferenceChoices[0] ?? "1순위";
  const scoreSheets = filteredAndSortedData[preferenceIndex] ?? [];

  useEffect(() => {
    if (preferenceIndex < preferenceChoices.length) return;
    setPreferenceIndex(0);
  }, [preferenceChoices.length, preferenceIndex]);

  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      router.replace("/university/application/apply");
    }
  }, [isError, isLoading, router]);

  const hotKeyWords = ["RMIT", "오스트라바", "칼스루에", "그라츠", "추오", "프라하", "보라스", "빈", "메모리얼"];

  return (
    <div className="px-5">
      <ApplicationSectionTitle
        className="mb-3 mt-5"
        title="지원자 현황"
        description="지원 순위와 지역 필터로 원하는 학교 현황을 빠르게 확인할 수 있어요."
      />
      <ScoreSearchBar onClick={handleSearchClick} textRef={searchRef} searchHandler={handleSearch} />

      {searchActive ? (
        <div className="mt-3 rounded-lg bg-white py-4 shadow-sdwB">
          <ScoreSearchField keyWords={hotKeyWords} setKeyWord={handleSearchField} />
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-lg bg-white px-2 shadow-sdwB">
            <Tab choices={preferenceChoices} choice={selectedPreference} setChoice={handlePreferenceChange} />
          </div>
          <ButtonTab
            choices={REGIONS_KO}
            choice={regionFilter}
            setChoice={(newRegion) => {
              if (searchRef.current) searchRef.current.value = "";
              setSearchValue("");
              setRegionFilter(newRegion as RegionKo | "");
            }}
            style={{ padding: "10px 0 10px 8px" }}
          />

          <div className="mx-auto mt-3 flex w-full flex-col gap-3 overflow-x-auto pb-4">
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
