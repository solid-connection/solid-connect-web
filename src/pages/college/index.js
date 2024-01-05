import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import CollegeList from "../../components/college/list/college-list";
import CollegeSearch from "@/components/college/list/college-search";
import TopNavigation from "@/components/layout/top-navigation";
import ButtonTab from "@/components/ui/button-tab";

export default function CollegePage(props) {
  const router = useRouter();
  const { colleges, countries } = props;
  const [searchText, setSearchText] = useState(router.query.query || "");
  const filters = ["유럽권", "미주권", "아시아권"];
  const [filter, setFilter] = useState({ country: "", region: "", text: "" });

  const [filteredColleges, setFilteredColleges] = useState(colleges);

  useEffect(() => {
    const { query } = router.query;

    setFilteredColleges(colleges);
  }, [router.query, colleges]);

  function findCollegeHandler() {
    let path = "/college";
    if (searchText) {
      path += `?query=${searchText}`;
    }
    router.push(path);
  }

  return (
    <>
      <TopNavigation />
      <CollegeSearch searchHandler={findCollegeHandler} text={searchText} setText={setSearchText} />
      <ButtonTab choices={filters} choice={filter} setChoice={setFilter} color={{ deactiveBtn: "#D9D9D9" }} style={{ marginTop: "14px" }} />
      <CollegeList colleges={filteredColleges} />
    </>
  );
}

export function getServerSideProps(context) {
  const { query } = context;
  const { country, region, text } = query;
  const colleges = getCollegeList(country, region, text);

  const countries = [
    { id: 1, name: "Canada", regions: ["Ontario", "Quebec", "British Columbia"] },
    { id: 2, name: "United States", regions: ["New York", "California", "Texas"] },
  ];

  return {
    props: { colleges: colleges, countries: countries },
  };
}

function getCollegeList(country, region, text) {
  let colleges = [
    { uuid: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: [{ TOEIC: 775 }, { TOEFL: 90 }, { IELTS: 6.5 }], capacity: 3 },
    { uuid: 2, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: [{ TOEIC: 775 }, { TOEFL: 90 }], capacity: 5 },
    { uuid: 2, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: [{ TOEIC: 775 }], capacity: 5 },
  ];
  if (text) {
    colleges.push({ uuid: 3, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" });
  }
  return colleges;
}
