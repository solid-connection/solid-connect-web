import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import CollegeCards from "../../components/college/list/college-cards";
import CollegeSearch from "@/components/college/list/college-search";
import TopNavigation from "@/components/layout/top-navigation";
import ButtonTab from "@/components/ui/button-tab";
import { getCollegeListData } from "../api/college";

export default function CollegePage(props) {
  const { colleges, countries } = props;
  const router = useRouter();
  const keyword: string | string[] = router.query.keyword;
  const initialSearchText: string = Array.isArray(keyword) ? keyword[0] : keyword;

  const [searchText, setSearchText] = useState<string>(initialSearchText || "");
  const filters = ["전체", "유럽권", "미주권", "아시아권", "중국권"];
  const [filter, setFilter] = useState<string>("전체");
  const [filteredColleges, setFilteredColleges] = useState(colleges);

  useEffect(() => {
    const filtered = colleges.filter((college) => {
      const matchesRegion = filter === "전체" || filter === null ? true : college.region === filter;
      const matchesSearchText = searchText ? college.koreanName.toLowerCase().includes(searchText.toLowerCase()) || college.country.includes(searchText.toLowerCase()) : true;
      return matchesRegion && matchesSearchText;
    });

    setFilteredColleges(filtered);
  }, [filter, searchText, colleges]);

  // useEffect(() => {
  //   const { query } = router.query;

  //   setFilteredColleges(colleges);
  // }, [router.query, colleges]);

  function findCollegeHandler(event) {
    event.preventDefault();
    // let path = "/college";
    // if (searchText) {
    //   path += `?query=${searchText}`;
    // }
    // router.push(path);
  }

  return (
    <>
      <Head>
        <title>솔리드 커넥션</title>
      </Head>
      <TopNavigation />
      <CollegeSearch searchHandler={findCollegeHandler} text={searchText} setText={setSearchText} />
      <ButtonTab choices={filters} choice={filter} setChoice={setFilter} color={{ deactiveBtn: "#D9D9D9" }} style={{ marginTop: "14px", marginLeft: "18px" }} />
      <CollegeCards colleges={filteredColleges} style={{ marginTop: "12px" }} />
    </>
  );
}

async function getCollegeList(region, text) {
  const response = await getCollegeListData();
  const colleges = response.data;
  const filteredColleges = colleges.filter((college) => {
    const matchesRegion = region ? college.region === region : true;
    const matchesSearchText = text ? college.name.toLowerCase().includes(text.toLowerCase()) : true;
    return matchesRegion && matchesSearchText;
  });
  return filteredColleges;
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { country, region, text } = query;
  const colleges = await getCollegeList(region, text);

  return {
    props: { colleges },
  };
}