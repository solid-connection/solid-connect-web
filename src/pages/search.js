import { useState } from "react";
import { useRouter } from "next/router";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeSearchBar from "@/components/home/search/college-search-bar";
import CollegeSearchField from "@/components/home/search/college-search-field";

export default function HomeSearchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const keyWords = ["하와이", "보라스", "릴카톨릭", "파리8", "낭트", "헐", "함부르크", "오스트라바"];

  function searchHandler() {
    // 임시
    router.push(`/college?keyword=${searchText}`);
  }
  return (
    <div>
      <TopDetailNavigation title="키워드 검색" />
      <CollegeSearchBar text={searchText} setText={setSearchText} searchHandler={searchHandler} />
      <CollegeSearchField setText={setSearchText} keyWords={keyWords} searchHandler={searchHandler} />
    </div>
  );
}
