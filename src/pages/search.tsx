import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getPopularKeywordsPublicApi, postSearchKeywordPublicApi } from "@/services/keyword";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeSearchBar from "@/components/search/college-search-bar";
import CollegeSearchField from "@/components/search/college-search-field";

export default function HomeSearchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [keyWords, setKeyWords] = useState([]);

  useEffect(() => {
    const loadPopularKeywords = async () => {
      const res = await getPopularKeywordsPublicApi();
      const popularKeywords = res.data;
      setKeyWords(popularKeywords);
    };
    loadPopularKeywords();
  }, []);

  function searchHandler(e) {
    e.preventDefault();
    postSearchKeywordPublicApi(searchText)
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
      <CollegeSearchBar
        text={searchText}
        setText={setSearchText}
        searchHandler={(e) => {
          searchHandler(e);
        }}
        onClick={() => {}}
      />
      <CollegeSearchField setText={setSearchText} keyWords={keyWords} />
    </div>
  );
}
