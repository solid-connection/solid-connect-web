import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// import { getPopularKeywords, saveSearchKeyword } from "@/lib/firebaseServices";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeSearchBar from "@/components/search/college-search-bar";
import CollegeSearchField from "@/components/search/college-search-field";
import { getPopularKeywords, saveSearchKeyword } from "@/lib/keywords";

export default function HomeSearchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [keyWords, setKeyWords] = useState([]);

  useEffect(() => {
    async function loadPopularKeywords() {
      const popularKeywords = await getPopularKeywords();
      setKeyWords(popularKeywords);
    }

    loadPopularKeywords();
  }, []);

  function searchHandler(e) {
    e.preventDefault();
    saveSearchKeyword(searchText)
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
