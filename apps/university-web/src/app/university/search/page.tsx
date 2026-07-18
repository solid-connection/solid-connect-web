import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";
import SearchClientContent, { SearchDesktopContent } from "./SearchClientContent";

export const revalidate = false;

export const metadata: Metadata = {
  title: "파견 학교 목록",
  robots: NO_INDEX_ROBOTS,
};

const Page = async () => {
  return (
    <>
      <TopDetailNavigation title="파견학교 검색" />
      <div className="w-full md:hidden">
        <main className="flex flex-1 flex-col p-5">
          <h2 className="mb-1 typo-bold-1">오직 나를 위한</h2>
          <h2 className="mb-6 typo-bold-1">맞춤 파견 학교 찾기</h2>
          <SearchClientContent />
        </main>
      </div>
      <div className="hidden desktop-page-shell md:block">
        <div>
          <header className="mb-8">
            <p className="text-primary typo-sb-9">Search</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">맞춤 파견 학교 찾기</h1>
            <p className="mt-2 text-k-500 typo-medium-2">
              소속 학교와 관심 조건을 조합해서 지원 가능한 파견 학교를 찾아보세요.
            </p>
          </header>
          <SearchDesktopContent />
        </div>
      </div>
    </>
  );
};

export default Page;
