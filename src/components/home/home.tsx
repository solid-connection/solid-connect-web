import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  IconApplicantBanner,
  IconScoreBanner,
  IconSearchBanner,
  IconSpeaker,
  IconTablerSearch,
} from "../../../public/svgs";
import HomeCollegeCards from "./home-college-cards";
import NewsCards from "./news-cards";

import { News } from "@/types/news";
import { ListUniversity } from "@/types/university";

type HomeProps = {
  recommendedColleges: ListUniversity[];
  newsList: News[];
};

export default function Home({ recommendedColleges, newsList }: HomeProps) {
  return (
    <div className="pl-5 pt-6">
      <CollegeSearch />

      <Link
        href="/college"
        className="mr-[20px] mt-[15px] flex justify-between gap-[23px] rounded-[8px] bg-[#f0f5ff] p-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col gap-[4px]">
          <div className="mt-[6px] font-serif text-[16px] font-bold leading-[150%] text-[#497fe2]">
            아직 학교를 결정하지 못했다면?
          </div>
          <div className="font-serif text-[10px] font-normal leading-[150%] text-[#353535]">
            나의 성적과 지역만 선택하고
            <br />
            모든 학교 목록을 확인해보세요!
          </div>
        </div>
        <div>
          <IconSearchBanner />
        </div>
      </Link>

      <div className="mr-[20px] mt-[20px] flex gap-[15px]">
        <Link
          href="/score/register"
          className="flex h-[100px] w-full flex-col justify-between rounded-[8px] bg-[#fff3e5] p-[10px_5px_5px_10px]"
        >
          <div>
            <div className="font-serif text-[14px] font-bold leading-[150%] text-[#ff670a]">성적 입력하기</div>
            <div className="mt-[2px] font-serif text-[10px] font-normal leading-[150%] text-[#353535]">
              성적 입력하고 등수를 확인해보세요
            </div>
          </div>
          <div className="flex justify-end">
            <IconScoreBanner />
          </div>
        </Link>
        <Link
          href="/score"
          className="flex h-[100px] w-full flex-col justify-between rounded-[8px] bg-[#e9f7ec] p-[10px_5px_5px_10px]"
        >
          <div>
            <div className="font-serif text-[14px] font-bold leading-[150%] text-[#339660]">지원자 현황 확인</div>
            <div className="mt-[2px] font-serif text-[10px] font-normal leading-[150%] text-[#353535]">
              경쟁률을 바로 분석해드려요
            </div>
          </div>
          <div className="flex justify-end">
            <IconApplicantBanner />
          </div>
        </Link>
      </div>

      <div style={{ marginTop: "20px" }}>
        <div className="mb-[10px] flex items-center gap-[6px] font-serif text-[16px] font-semibold text-[#44413d]">
          추천하는 파견학교
        </div>
        <HomeCollegeCards colleges={recommendedColleges} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <div className="mb-[10px] flex items-center gap-[6px] font-serif text-[16px] font-semibold text-[#44413d]">
          솔커에서 맛보는 소식
          <IconSpeaker />
        </div>
        <NewsCards newsList={newsList} />
      </div>
    </div>
  );
}

function CollegeSearch() {
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  const onSearch = (e) => {
    e.preventDefault();
    router.push(`/college?keyword=${searchText}`);
  };
  return (
    <div className="mr-5">
      <form className="flex items-center rounded-[8px] bg-[#f7f7f7] pr-[16px]" onSubmit={onSearch}>
        <input
          className="text-black box-border w-full rounded-[8px] border-none bg-[#f7f7f7] p-[12px_16px] font-serif text-[14px] font-normal uppercase leading-[150%] tracking-[-0.35px] outline-none placeholder:text-[#a8a8a8]"
          type="text"
          placeholder="원하는 해외 학교를 검색해보세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="bg-transparent cursor-pointer border-0" type="submit">
          <IconTablerSearch />
        </button>
      </form>
    </div>
  );
}
