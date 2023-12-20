import { Fragment } from "react";

import CollegeList from "../../components/college/college-list";
import CollegeSearch from "@/components/college/college-search";

function CollegePage(props) {
  const { colleges } = props;
  return (
    <Fragment>
      <CollegeSearch />
      <CollegeList colleges={colleges} />
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
