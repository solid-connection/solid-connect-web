"use client";

import type { News } from "@/types/news";
import type { AllRegionsUniversityList, ListUniversity } from "@/types/university";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import FindLastYearScoreBar from "../FindLastYearScoreBar";
import HomeDesktopView from "../HomeDesktopView";
import HomeEntrySection from "../HomeEntrySection";
import NewsSection from "../NewsSection";
import PopularUniversitySection from "../PopularUniversitySection";
import UniversityList from "../UniversityList";

type HomeResponsiveContentProps = {
  recommendedUniversities: ListUniversity[];
  allRegionsUniversityList: AllRegionsUniversityList;
  newsList: News[];
};

const HomeResponsiveContent = ({
  recommendedUniversities,
  allRegionsUniversityList,
  newsList,
}: HomeResponsiveContentProps) => {
  const isDesktop = useIsDesktopViewport();

  if (isDesktop === null) {
    return <div aria-hidden className="min-h-screen bg-white md:bg-k-50" />;
  }

  if (isDesktop) {
    return (
      <HomeDesktopView
        recommendedUniversities={recommendedUniversities}
        allRegionsUniversityList={allRegionsUniversityList}
        newsList={newsList}
      />
    );
  }

  return (
    <div className="w-full">
      <FindLastYearScoreBar />
      <HomeEntrySection />

      <div className="border-t-[5px] border-k-50 py-5 pl-5">
        <div className="mb-2 flex items-center gap-1.5 font-serif text-k-700 typo-sb-7">실시간 인기있는 파견학교</div>
        <PopularUniversitySection universities={recommendedUniversities} />
      </div>

      <div className="p-5">
        <UniversityList allRegionsUniversityList={allRegionsUniversityList} />
      </div>

      <NewsSection newsList={newsList} />
    </div>
  );
};

export default HomeResponsiveContent;
