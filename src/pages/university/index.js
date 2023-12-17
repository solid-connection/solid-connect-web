import { Fragment } from "react";

import UniversityList from "../../components/university/university-list";
import classes from "./index.module.css";
import UniversitySearch from "@/components/university/university-search";

function UniversityPage() {
  const universities = [
    { uuid: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
    { uuid: 2, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90" },
  ];
  return (
    <Fragment>
      <UniversitySearch />
      <UniversityList universities={universities} />
    </Fragment>
  );
}

export default UniversityPage;
