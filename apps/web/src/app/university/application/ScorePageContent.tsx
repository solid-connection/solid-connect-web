"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useGetApplicationsList } from "@/apis/applications";
import ConfirmCancelModal from "@/components/modal/ConfirmCancelModal";
import ButtonTab from "@/components/ui/ButtonTab";
import Tab from "@/components/ui/Tab";
import { DEFAULT_MAX_CHOICE_COUNT, getHomeUniversityById, REGIONS_KO } from "@/constants/university";
import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ScoreSheet as ScoreSheetType } from "@/types/application";
import type { RegionKo } from "@/types/university";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import ApplicationSectionTitle from "./_components/ApplicationSectionTitle";
import ScoreSearchBar from "./ScoreSearchBar";
import ScoreSearchField from "./ScoreSearchField";
import ScoreSheet from "./ScoreSheet";

type ScorePageViewProps = {
  searchRef: RefObject<HTMLInputElement>;
  searchActive: boolean;
  regionFilter: RegionKo | "";
  preferenceChoices: string[];
  selectedPreference: string;
  scoreSheets: ScoreSheetType[];
  hotKeyWords: string[];
  onSearch: (event: FormEvent) => void;
  onSearchClick: () => void;
  onKeywordClick: (keyword: string) => void;
  onPreferenceChange: (nextPreference: string) => void;
  onMobileRegionChange: (nextRegion: string | null | ((prev: string | null) => string | null)) => void;
  onDesktopRegionChange: (nextRegion: RegionKo | "") => void;
};

const ScorePageContent = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null!);
  const isDesktop = useIsDesktopViewport();
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
    const uniqueByKoreanName = (data: ScoreSheetType[]) => {
      const universityMap = new Map(data.map((sheet) => [sheet.koreanName, sheet]));
      return Array.from(universityMap.values());
    };

    const sortedData = scoreChoices.map((choice) =>
      uniqueByKoreanName(choice).sort((a, b) => b.applicants.length - a.applicants.length),
    );

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

  const applyRegionFilter = (nextRegion: RegionKo | "") => {
    if (searchRef.current) searchRef.current.value = "";
    setSearchValue("");
    setRegionFilter(nextRegion);
  };

  const handleMobileRegionChange = (nextRegion: string | null | ((prev: string | null) => string | null)) => {
    const resolvedRegion = typeof nextRegion === "function" ? nextRegion(regionFilter || null) : nextRegion;
    applyRegionFilter((resolvedRegion ?? "") as RegionKo | "");
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

  if (isDesktop === null) return null;

  const hotKeyWords = ["RMIT", "오스트라바", "칼스루에", "그라츠", "추오", "프라하", "보라스", "빈", "메모리얼"];
  const viewProps = {
    searchRef,
    searchActive,
    regionFilter,
    preferenceChoices,
    selectedPreference,
    scoreSheets,
    hotKeyWords,
    onSearch: handleSearch,
    onSearchClick: handleSearchClick,
    onKeywordClick: handleSearchField,
    onPreferenceChange: handlePreferenceChange,
    onMobileRegionChange: handleMobileRegionChange,
    onDesktopRegionChange: applyRegionFilter,
  };

  return (
    <>
      {isDesktop ? <ApplicationScoreDesktopView {...viewProps} /> : <ApplicationScoreMobileView {...viewProps} />}
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
  );
};

const ApplicationScoreMobileView = ({
  searchRef,
  searchActive,
  regionFilter,
  preferenceChoices,
  selectedPreference,
  scoreSheets,
  hotKeyWords,
  onSearch,
  onSearchClick,
  onKeywordClick,
  onPreferenceChange,
  onMobileRegionChange,
}: ScorePageViewProps) => {
  return (
    <div className="px-5">
      <ApplicationSectionTitle
        className="mb-3 mt-5"
        title="지원자 현황"
        description="지원 순위와 지역 필터로 원하는 학교 현황을 빠르게 확인할 수 있어요."
      />
      <ScoreSearchBar onClick={onSearchClick} textRef={searchRef} searchHandler={onSearch} />

      {searchActive ? (
        <div className="mt-3 rounded-lg bg-white py-4 shadow-sdwB">
          <ScoreSearchField keyWords={hotKeyWords} setKeyWord={onKeywordClick} />
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-lg bg-white px-2 shadow-sdwB">
            <Tab choices={preferenceChoices} choice={selectedPreference} setChoice={onPreferenceChange} />
          </div>
          <ButtonTab
            choices={REGIONS_KO}
            choice={regionFilter}
            setChoice={onMobileRegionChange}
            style={{ padding: "10px 0 10px 8px" }}
          />

          <div className="mx-auto mt-3 flex w-full flex-col gap-3 overflow-x-auto pb-4">
            {scoreSheets.map((choice) => (
              <ScoreSheet key={choice.koreanName} scoreSheet={choice} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ApplicationScoreDesktopView = ({
  searchRef,
  searchActive,
  regionFilter,
  preferenceChoices,
  selectedPreference,
  scoreSheets,
  hotKeyWords,
  onSearch,
  onSearchClick,
  onKeywordClick,
  onPreferenceChange,
  onDesktopRegionChange,
}: ScorePageViewProps) => {
  return (
    <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-primary typo-sb-9">Application scores</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">지원자 현황</h1>
          <p className="mt-2 text-k-500 typo-medium-2">
            지원 순위, 지역, 학교명으로 현재 경쟁 현황을 빠르게 확인하세요.
          </p>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          <section className="min-h-[620px] rounded-lg border border-k-100 bg-white p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-k-900 typo-bold-4">{selectedPreference} 학교 현황</h2>
                <p className="mt-1 text-k-500 typo-medium-3">조건에 맞는 학교 {scoreSheets.length}개</p>
              </div>
              <div className="w-80">
                <Tab choices={preferenceChoices} choice={selectedPreference} setChoice={onPreferenceChange} />
              </div>
            </div>

            {scoreSheets.length === 0 ? (
              <ApplicationScoreEmptyState />
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {scoreSheets.map((choice) => (
                  <ScoreSheet key={choice.koreanName} scoreSheet={choice} variant="desktop" />
                ))}
              </div>
            )}
          </section>

          <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
            <h2 className="text-k-900 typo-bold-4">검색 및 필터</h2>
            <div className="mt-5">
              <ScoreSearchBar onClick={onSearchClick} textRef={searchRef} searchHandler={onSearch} />
            </div>

            <div className={clsx("mt-5", searchActive ? "block" : "hidden xl:block")}>
              <h3 className="text-k-800 typo-sb-7">인기 검색</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {hotKeyWords.map((keyWord) => (
                  <button
                    key={keyWord}
                    type="button"
                    className="rounded-full bg-k-50 px-3 py-[5px] text-k-800 transition-colors hover:bg-k-100 typo-medium-2"
                    onClick={() => onKeywordClick(keyWord)}
                  >
                    {keyWord}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-k-800 typo-sb-7">지역 필터</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <DesktopRegionButton isActive={regionFilter === ""} onClick={() => onDesktopRegionChange("")}>
                  전체
                </DesktopRegionButton>
                {REGIONS_KO.map((region) => (
                  <DesktopRegionButton
                    key={region}
                    isActive={regionFilter === region}
                    onClick={() => onDesktopRegionChange(region as RegionKo)}
                  >
                    {region}
                  </DesktopRegionButton>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const DesktopRegionButton = ({
  children,
  isActive,
  onClick,
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "rounded-full px-3 py-1.5 transition-colors typo-medium-2",
      isActive ? "bg-primary text-white" : "bg-k-50 text-k-500 hover:bg-k-100 hover:text-k-700",
    )}
  >
    {children}
  </button>
);

const ApplicationScoreEmptyState = () => (
  <div className="mt-6 flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-k-100 bg-white px-6 py-8 text-center">
    <p className="text-k-900 typo-sb-5">조건에 맞는 학교가 없어요.</p>
    <p className="mt-2 text-k-500 typo-medium-3">다른 순위, 지역, 검색어로 다시 확인해 주세요.</p>
  </div>
);

export default ScorePageContent;
