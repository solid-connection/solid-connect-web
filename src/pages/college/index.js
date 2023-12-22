import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";

import CollegeList from "../../components/college/college-list";
import CollegeSearch from "@/components/college/college-search";
import CollegeFilter from "@/components/college/college-filter";

export default function CollegePage(props) {
  const router = useRouter();
  const { colleges, countries } = props;

  const [filteredColleges, setFilteredColleges] = useState(colleges);

  useEffect(() => {
    const { country, region, text } = router.query;

    // const filtered = colleges.filter((college) => {
    //   return (!country || college.country === country) && (!region || college.region === region) && (!text || college.name.includes(text));
    // });

    setFilteredColleges(colleges);
  }, [router.query, colleges]);

  function findCollegeHandler(country, region, text) {
    let path = "/college";
    if (country) {
      path += `?country=${country}`;
      if (region) {
        path += `&region=${region}`;
      }
    }
    if (text) {
      if (!country) path += "?";
      else path += "&";
      path += `text=${text}`;
    }
    router.push(path);
  }

  return (
    <Fragment>
      <CollegeSearch countries={countries} onSearch={findCollegeHandler} />
      <CollegeFilter />
      <CollegeList colleges={filteredColleges} />
    </Fragment>
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
    { uuid: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
    { uuid: 2, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
  ];
  if (text) {
    colleges.push({ uuid: 3, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" });
  }
  return colleges;
}
