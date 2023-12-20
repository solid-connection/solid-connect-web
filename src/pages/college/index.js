import { Fragment, useState } from "react";

import CollegeList from "../../components/college/college-list";
import CollegeSearch from "@/components/college/college-search";
import CollegeFilter from "@/components/college/college-filter";

function CollegePage(props) {
  const { colleges } = props;

  const [filteredColleges, setFilteredColleges] = useState(colleges);

  return (
    <Fragment>
      <CollegeSearch />
      <CollegeFilter />
      <CollegeList colleges={filteredColleges} />
    </Fragment>
  );
}

export function getServerSideProps() {
  return {
    props: {
      colleges: [
        { uuid: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
        { uuid: 2, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
      ],
    },
  };
}

export default CollegePage;

export const runtime = "experimental-edge";
