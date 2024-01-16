import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import CollegeList from "../../components/college/list/college-list";
import CollegeSearch from "@/components/college/list/college-search";
import TopNavigation from "@/components/layout/top-navigation";
import ButtonTab from "@/components/ui/button-tab";
import { getCollegeListData } from "../api/college";

export default function CollegePage(props) {
  const router = useRouter();
  const { colleges, countries } = props;

  const [searchText, setSearchText] = useState(router.query.query || "");
  const filters = ["유럽권", "미주권", "아시아권", "중국권"];
  const [filter, setFilter] = useState("");
  const [filteredColleges, setFilteredColleges] = useState(colleges);

  useEffect(() => {
    const filtered = colleges.filter((college) => {
      const matchesRegion = filter ? college.region === filter : true;
      const matchesSearchText = searchText ? college.name.toLowerCase().includes(searchText.toLowerCase()) : true;
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
      <TopNavigation />
      <CollegeSearch searchHandler={findCollegeHandler} text={searchText} setText={setSearchText} />
      <ButtonTab choices={filters} choice={filter} setChoice={setFilter} color={{ deactiveBtn: "#D9D9D9" }} style={{ marginTop: "14px", marginLeft: "18px" }} />
      <CollegeList colleges={filteredColleges} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { country, region, text } = query;
  const colleges = await getCollegeList(region, text);

  return {
    props: { colleges: colleges },
  };
}

async function getCollegeList(region, text) {
  const colleges = await getCollegeListData();
  const filteredColleges = colleges.filter((college) => {
    const matchesRegion = region ? college.region === region : true;
    const matchesSearchText = text ? college.name.toLowerCase().includes(text.toLowerCase()) : true;
    return matchesRegion && matchesSearchText;
  });
  return filteredColleges;
}
