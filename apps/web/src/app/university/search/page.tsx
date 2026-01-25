import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import SchoolSearchForm from "./PageContent";
import SearchBar from "./SearchBar";

export const metadata: Metadata = {
  title: "파견 학교 목록",
};

const Page = async () => {
  return (
    <>
      <TopDetailNavigation title="파견학교 검색" />
      <div className="w-full">
        <main className="flex flex-1 flex-col p-5">
          <h2 className="mb-1 typo-bold-1">오직 나를 위한</h2>
          <h2 className="mb-6 typo-bold-1">맞춤 파견 학교 찾기</h2>
          <div className="relative mb-4">
            <SearchBar />
          </div>
          <SchoolSearchForm />
        </main>
      </div>
    </>
  );
};

export default Page;
