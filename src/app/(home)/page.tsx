import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import FindLastYearScoreBar from "./_ui/FindLastYearScoreBar";
import NewsSectionSkeleton from "./_ui/NewsSection/skeleton";
import PopularUniversitySection from "./_ui/PopularUniversitySection";
import UniversityList from "./_ui/UniversityList";

import getRecommendedUniversity from "@/api/university/server/getRecommendedUniversity";
import { getCategorizedUniversities } from "@/api/university/server/getSearchUniversitiesByText";
import { fetchAllNews } from "@/lib/firebaseNews";
import { IconIdCard, IconMagnifyingGlass, IconMuseum, IconPaper } from "@/public/svgs/home";

const NewsSectionDynamic = dynamic(() => import("./_ui/NewsSection"), {
  ssr: false,
  loading: () => <NewsSectionSkeleton />,
});

export const metadata: Metadata = {
  title: "솔리드 커넥션 – 교환학생의 첫 걸음",
  description: "교환학생 준비를 위한 모든 정보가 여기에!",
  alternates: {
    canonical: "https://solid-connection.com/",
  },
};

const HomePage = async () => {
  const newsList = await fetchAllNews();
  const { data } = await getRecommendedUniversity();
  const recommendedUniversities = data?.recommendedUniversities || [];
  // 권역별 전체 대학 리스트를 미리 가져와 빌드합니다
  const allRegionsUniversityList = await getCategorizedUniversities();

  return (
    <div className="w-full">
      <FindLastYearScoreBar />
      <div className="flex flex-col gap-2.5 px-5 py-3.5">
        <div className="flex gap-2">
          <Link
            className="h-26 bg-bg-accent-blue flex flex-1 flex-col gap-2 rounded-lg p-2.5"
            href="/university/search"
          >
            <div className="flex flex-col">
              <span className="typo-bold-5 text-secondary">학교 검색하기</span>
              <span className="typo-medium-4 text-k-700">모든 학교 목록을 확인해보세요</span>
            </div>
            <div className="flex justify-end">
              <IconMagnifyingGlass />
            </div>
          </Link>
          <Link className="h-26 bg-bg-accent-sky flex flex-1 flex-col gap-2 rounded-lg p-2.5" href="/university/score">
            <div className="flex flex-col">
              <span className="typo-bold-5 text-sub-a">성적 입력하기</span>
              <span className="typo-medium-4 text-k-700">성적을 입력해보세요</span>
            </div>
            <div className="flex justify-end">
              <IconPaper />
            </div>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link
            className="h-26 bg-bg-accent-orange flex flex-1 flex-col gap-2 rounded-lg p-2.5"
            href="/university/application/apply"
          >
            <div className="flex flex-col">
              <span className="typo-bold-5 text-accent-custom-orange">학교 지원하기</span>
              <span className="typo-medium-4 text-k-700">학교를 지원해주세요</span>
            </div>
            <div className="flex justify-end">
              <IconMuseum />
            </div>
          </Link>
          <Link
            className="h-26 bg-bg-accent-green flex flex-1 flex-col gap-2 rounded-lg p-2.5"
            href="/university/application"
          >
            <div className="flex flex-col">
              <span className="typo-bold-5 text-accent-custom-green">지원자 현황 확인</span>
              <span className="typo-medium-4 text-k-700">경쟁률을 바로 분석해드려요</span>
            </div>
            <div className="flex justify-end">
              <IconIdCard />
            </div>
          </Link>
        </div>
      </div>

      <div className="border-t-[5px] border-k-50 py-5 pl-5">
        <div className="typo-sb-7 mb-2 flex items-center gap-1.5 font-serif text-k-700">실시간 인기있는 파견학교</div>
        <PopularUniversitySection universities={recommendedUniversities} />
      </div>

      <div className="p-5">
        <UniversityList allRegionsUniversityList={allRegionsUniversityList} />
      </div>

      <NewsSectionDynamic newsList={newsList} />
    </div>
  );
};

export default HomePage;

export const revalidate = 60 * 60 * 24; // 1 day
