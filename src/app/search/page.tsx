import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import SearchContent from "./SearchContent";

export const metadata: Metadata = {
  title: "파견학교 검색",
};

const SearchPage = () => {
  return (
    <>
      <TopDetailNavigation title="파견학교 검색" />
      <div>
        <div className="px-5 py-6">
          <span className="text-[22px] font-bold leading-normal text-k-900">
            오직 나를 위한
            <br />
            맞춤 파견 학교 찾기
          </span>
        </div>
        <SearchContent />
      </div>
    </>
  );
};

export default SearchPage;
