import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { ListCollege } from "@/types/college";

import CollegeCards from "../../components/college/list/college-cards";
import CollegeSearch from "@/components/college/list/college-search";
import TopNavigation from "@/components/layout/top-navigation";
import ButtonTab from "@/components/ui/button-tab";
import { getCollegeListData } from "../api/college";

export default function CollegePage({ colleges }: { colleges: ListCollege[] }) {
  const router = useRouter();
  const queryRegion: string = Array.isArray(router.query.region) ? router.query.region[0] : router.query.region;
  const querySearchTexts: string[] = Array.isArray(router.query.keyword) ? router.query.keyword : [router.query.keyword];
  const queryTestScore: string = Array.isArray(router.query.testScore) ? router.query.testScore[0] : router.query.testScore;
  let queryTest: string | null = Array.isArray(router.query.test) ? router.query.test[0] : router.query.test;
  if (!["TOEIC", "TOEFL_IBT", "TOEFL_ITP", "IELTS", "JLPT"].includes(queryTest)) queryTest = null;

  const [searchTexts, setSearchTexts] = useState<string[]>(querySearchTexts[0] !== undefined ? querySearchTexts : [""]);
  const searchTextRef = useRef<HTMLInputElement | null>(null);

  const regions = ["전체", "유럽권", "미주권", "아시아권", "중국권"];
  const [region, setRegion] = useState<string>(queryRegion || "전체");

  const [filteredColleges, setFilteredColleges] = useState(colleges);

  // 필터링
  useEffect(() => {
    const filtered = colleges.filter((college) => {
      // 지역 필터
      const matchesRegion = region === "전체" || region === null ? true : college.region === region;
      // 검색 필터
      let matchesSearchText = true;
      if (searchTexts && searchTexts.length) {
        matchesSearchText = searchTexts.some((searchTerm) => college.koreanName.toLowerCase().includes(searchTerm.toLowerCase()) || college.country.includes(searchTerm.toLowerCase()));
      }
      // 성적 필터
      let matchesTest: boolean = true;
      if (queryTest) {
        matchesTest = college.languageRequirements.some((req) => req.languageTestType === queryTest);
        // if (queryTestScore) {
        //   const testScore = queryTestScore.replace(/\D/g, "");
        //   if (queryTest === "JLPT") {
        //     matchesTest = college.languageRequirements.find((req) => req.languageTestType === queryTest && req.minScore <= testScore) ? true : false;
        //   } else {
        //     matchesTest = college.languageRequirements.find((req) => req.languageTestType === queryTest && req.minScore >= testScore) ? true : false;
        //   }
        // }
      }
      return matchesRegion && matchesSearchText && matchesTest;
    });
    setFilteredColleges(filtered);
  }, [region, searchTexts]);

  // 쿼리스트링 업데이트
  useEffect(() => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          region: region !== "전체" ? region : undefined,
          keyword: searchTexts.filter((text) => text).join(",") || undefined,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [region, searchTexts]);

  function searchHandler(event) {
    event.preventDefault();
    const searchTerms: string[] = searchTextRef.current.value
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term !== "");
    setSearchTexts(searchTerms);
  }

  return (
    <>
      <Head>
        <title>솔리드 커넥션</title>
      </Head>
      <TopNavigation />
      <CollegeSearch searchHandler={searchHandler} textRef={searchTextRef} defaultValue={searchTexts.join(",")} />
      <ButtonTab choices={regions} choice={region} setChoice={setRegion} color={{ deactiveBtn: "#D9D9D9" }} style={{ marginTop: "14px", marginLeft: "18px" }} />
      <CollegeCards colleges={filteredColleges} style={{ marginTop: "12px" }} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const res = await getCollegeListData();
  const colleges = res.data;

  return {
    props: { colleges },
  };
}
