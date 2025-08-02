"use client";

import Image from "next/image";
import Link from "next/link";

import UniversityList from "../../components/home/UniversityList";
import PopularCollegeSection from "./_ui/PopularCollegeSection";

import { News } from "@/types/news";
import { ListUniversity } from "@/types/university";

import { IconSpeaker } from "@/public/svgs";
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
  recommendedColleges: ListUniversity[];
};

const Home = ({ newsList, recommendedColleges }: HomeProps) => {
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
        <PopularCollegeSection colleges={recommendedColleges} />
      </div>

      <div className="p-5">
        <UniversityList />
      </div>

      <div className="mt-6 pl-5">
        <div className="mb-[10px] flex items-center gap-[6px] font-serif text-[16px] font-semibold text-[#44413D]">
          솔커에서 맛보는 소식
          <IconSpeaker />
        </div>
        <div className="flex flex-col gap-4">
          {newsList.map((news) => (
            <a key={news.id} target="_blank" href={news.url} rel="noreferrer">
              <div className="flex gap-4">
                <Image
                  className="h-[90px] w-[170px] shrink-0 rounded-xl object-cover"
                  src={news.imageUrl}
                  alt={news.title}
                  width={170}
                  height={90}
                />
                <div className="mr-5 flex flex-col gap-0.5">
                  <div className="text-serif text-sm font-semibold leading-normal text-[#44413d]">{news.title}</div>
                  <div className="font-serif text-[10px] font-normal leading-normal text-[#808080]">
                    {news.description}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
