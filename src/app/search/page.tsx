import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

export const metadata: Metadata = {
  title: "파견학교 검색",
};

const SearchPage = () => {
  return (
    <>
      <TopDetailNavigation title="파견학교 검색" />
    </>
  );
};

export default SearchPage;
