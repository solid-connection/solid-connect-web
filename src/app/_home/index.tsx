import Image from "next/image";
import Link from "next/link";

import FindLastYearScoreBar from "./_ui/FindLastYearScoreBar";
import PopularCollegeSection from "./_ui/PopularCollegeSection";
import UniversityList from "./_ui/UniversityList";

import getRecommendedUniversity from "@/api/university/server/getRecommendedUniversity";
import { getAllRegionsUniversityList } from "@/api/university/server/getSearchUniversityList";
import { fetchAllNews } from "@/lib/firebaseNews";
import { IconSpeaker } from "@/public/svgs";
import { IconIdCard, IconMagnifyingGlass, IconMuseum, IconPaper } from "@/public/svgs/home";

const Home = async () => {
  const newsList = await fetchAllNews();

  // 추천 대학 정보를 가져옵니다
  const { data } = await getRecommendedUniversity();
  const recommendedColleges = data?.recommendedUniversities || [];

  // 권역별 전체 대학 리스트를 미리 가져와 빌드합니다
  const allRegionsUniversityList = await getAllRegionsUniversityList();

  return (
    <>
      <FindLastYearScoreBar />
      <div className="flex flex-col gap-2.5 px-5 py-3.5">
        <div className="flex gap-2">
          <Link className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-primary-100 p-2.5" href="/search">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary-900">학교 검색하기</span>
              <span className="text-xs font-medium leading-tight text-k-700">모든 학교 목록을 확인해보세요</span>
            </div>
            <div className="flex justify-end">
              <IconMagnifyingGlass />
            </div>
          </Link>
          <Link className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-sub-b-100 p-2.5" href="/score">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary-900">성적 입력하기</span>
              <span className="text-xs font-medium leading-tight text-k-700">성적을 입력해보세요</span>
            </div>
            <div className="flex justify-end">
              <IconPaper />
            </div>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-sub-c-100 p-2.5" href="/application/apply">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary-900">학교 지원하기</span>
              <span className="text-xs font-medium leading-tight text-k-700">학교를 지원해주세요</span>
            </div>
            <div className="flex justify-end">
              <IconMuseum />
            </div>
          </Link>
          <Link className="h-26 flex flex-1 flex-col gap-2 rounded-lg bg-sub-e-100 p-2.5" href="/application">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary-900">지원자 현황 확인</span>
              <span className="text-xs font-medium leading-tight text-k-700">경쟁률을 바로 분석해드려요</span>
            </div>
            <div className="flex justify-end">
              <IconIdCard />
            </div>
          </Link>
        </div>
      </div>

      <div className="border-t-[5px] border-k-50 py-5 pl-5">
        <div className="mb-2 flex items-center gap-1.5 font-serif text-base font-semibold text-k-700">
          실시간 인기있는 파견학교
        </div>
        <PopularCollegeSection colleges={recommendedColleges} />
      </div>

      <div className="p-5">
        <UniversityList allRegionsUniversityList={allRegionsUniversityList} />
      </div>

      <div className="mt-6 pl-5">
        <div className="mb-2.5 flex items-center gap-1.5 font-serif text-base font-semibold text-k-700">
          솔커에서 맛보는 소식
          <IconSpeaker />
        </div>
        <div className="flex flex-col gap-4">
          {newsList.map((news) => (
            <a key={news.id} target="_blank" href={news.url} rel="noreferrer">
              <div className="flex gap-4">
                <Image
                  loading="lazy"
                  placeholder="blur"
                  className="h-24 w-44 shrink-0 rounded-xl object-cover"
                  src={news.imageUrl}
                  alt={news.title}
                  width={170}
                  height={90}
                />
                <div className="mr-5 flex flex-col gap-0.5">
                  <div className="text-serif text-sm font-semibold leading-normal text-k-700">{news.title}</div>
                  <div className="font-serif text-xs font-normal leading-normal text-k-500">{news.description}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
