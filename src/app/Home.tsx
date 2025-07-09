"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import HomeCollegeCards from "../components/home/HomeCollegeCards";
import NewsCards from "../components/home/NewsCards";
import UniversityList from "../components/home/UniversityList";

import { News } from "@/types/news";
import { ListUniversity } from "@/types/university";

import { getRecommendedUniversitiesApi } from "@/api/university";
import { IconSpeaker, IconTablerSearch } from "@/public/svgs";
import {
  IconGraduationCap,
  IconIdCard,
  IconMagnifyingGlass,
  IconMuseum,
  IconPaper,
  IconRightArrow,
} from "@/public/svgs/home";

type HomeProps = {
  newsList: News[];
};

const Home = ({ newsList }: HomeProps) => {
  const [recommendedColleges, setRecommendedColleges] = useState<ListUniversity[]>([]);

  useEffect(() => {
    const fetchRecommendedColleges = async () => {
      try {
        const response = await getRecommendedUniversitiesApi();
        setRecommendedColleges(response.data.recommendedUniversities);
      } catch {
        setRecommendedColleges([]);
      }
    };

    fetchRecommendedColleges();
  }, []);

  return (
    <div className="">
      <div
        className="flex h-[60px] cursor-pointer items-center justify-between border-b border-k-100 px-5 py-3"
        onClick={() => alert("해당 기능은 현재 준비중입니다.")}
      >
        <div>
          <div className="flex items-center gap-4">
            <IconGraduationCap />
            <div className="flex flex-col">
              <span className="text-xs font-normal leading-normal text-k-800">작년 합격 점수가 궁금하신가요?</span>
              <span className="text-sm font-semibold leading-normal text-k-800">작년도 합격 점수 확인하러 가기</span>
            </div>
          </div>
        </div>
        <IconRightArrow />
      </div>

      <div className="flex flex-col gap-2.5 px-5 py-3.5">
        <div className="flex gap-[7px]">
          <Link className="flex h-[102px] flex-1 flex-col gap-2 rounded-lg bg-[#F0F5FF] p-2.5" href="/search">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary-900">학교 검색하기</span>
              <span className="text-[11px] font-medium leading-[14px] text-k-700">모든 학교 목록을 확인해보세요</span>
            </div>
            <div className="flex justify-end">
              <IconMagnifyingGlass />
            </div>
          </Link>
          <Link className="flex h-[102px] flex-1 flex-col gap-2 rounded-lg bg-[#E5F9FF] p-2.5" href="/score">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary-900">성적 입력하기</span>
              <span className="text-[11px] font-medium leading-[14px] text-k-700">성적을 입력해보세요</span>
            </div>
            <div className="flex justify-end">
              <IconPaper />
            </div>
          </Link>
        </div>
        <div className="flex gap-[7px]">
          <Link
            className="flex h-[102px] flex-1 flex-col gap-2 rounded-lg bg-[#FFF3E5] p-2.5"
            href="/application/apply"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary-900">학교 지원하기</span>
              <span className="text-[11px] font-medium leading-[14px] text-k-700">학교를 지원해주세요</span>
            </div>
            <div className="flex justify-end">
              <IconMuseum />
            </div>
          </Link>
          <Link className="flex h-[102px] flex-1 flex-col gap-2 rounded-lg bg-[#E9F7EC] p-2.5" href="/application">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary-900">지원자 현황 확인</span>
              <span className="text-[11px] font-medium leading-[14px] text-k-700">경쟁률을 바로 분석해드려요</span>
            </div>
            <div className="flex justify-end">
              <IconIdCard />
            </div>
          </Link>
        </div>
      </div>

      <div className="border-t-[5px] border-k-50 py-5 pl-5">
        <div className="mb-2 flex items-center gap-[6px] font-serif text-[16px] font-semibold text-[#44413D]">
          실시간 인기있는 파견학교
        </div>
        <HomeCollegeCards colleges={recommendedColleges} />
      </div>

      <div className="p-5">
        <UniversityList />
      </div>

      <div className="mt-6 pl-5">
        <div className="mb-[10px] flex items-center gap-[6px] font-serif text-[16px] font-semibold text-[#44413D]">
          솔커에서 맛보는 소식
          <IconSpeaker />
        </div>
        <NewsCards newsList={newsList} />
      </div>
    </div>
  );
};

export default Home;

const CollegeSearch = () => {
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/college?keyword=${searchText}`);
  };

  return (
    <div className="mr-5">
      <form className="flex items-center rounded-[8px] bg-[#f7f7f7] pr-[16px]" onSubmit={onSearch}>
        <input
          className="box-border w-full rounded-[8px] border-none bg-[#f7f7f7] p-[12px_16px] font-serif text-[14px] font-normal uppercase leading-[150%] tracking-[-0.35px] text-black outline-none placeholder:text-[#a8a8a8]"
          type="text"
          placeholder="원하는 해외 학교를 검색해보세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="cursor-pointer border-0 bg-transparent" type="submit" aria-label="대학 검색하기">
          <IconTablerSearch />
        </button>
      </form>
    </div>
  );
};
