import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeSearchBar from "@/components/search/college-search-bar";
import CollegeSearchField from "@/components/search/college-search-field";
import { getPopularKeywordsApi, postSearchKeywordApi } from "@/services/keyword";

export default function HomeSearchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [keyWords, setKeyWords] = useState([]);

  useEffect(() => {
    const loadPopularKeywords = async () => {
      const res = await getPopularKeywordsApi();
      const popularKeywords = res.data;
      setKeyWords(popularKeywords);
    };
    loadPopularKeywords();
  }, []);

  function searchHandler(e) {
    e.preventDefault();
    postSearchKeywordApi(searchText)
      .then(() => {
        router.push(`/college?keyword=${searchText}`);
      })
      .catch((error) => {
        console.error("Failed to add/update keyword: ", error);
      });
  }
  return (
    <div>
      <TopDetailNavigation title="키워드 검색" />
      <CollegeSearchBar text={searchText} setText={setSearchText} searchHandler={searchHandler} />
      <CollegeSearchField setText={setSearchText} keyWords={keyWords} searchHandler={searchHandler} />
    </div>
  );
}
