import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import SearchResultsContent from "./SearchResultsContent";

export const metadata: Metadata = {
  title: "파견 학교 목록",
};

const Page = async () => {
  return (
    <>
      <TopDetailNavigation title="파견학교 검색" />
      <SearchResultsContent />
    </>
  );
};

export default Page;
