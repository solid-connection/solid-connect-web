import Image from "next/image";

import CollegeDetail from "../../components/college/detail/college-detail";
import CollegeBottomSheet from "../../components/college/detail/college-bottomsheet";
import { Fragment } from "react";
import { getCollegeDetailData } from "../api/college/[id]";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";

export default function CollegeDetailPage(props) {
  return (
    <Fragment>
      <TopDetailNavigation title={props.name} />
      <CollegeDetail image={props.image} name={props.name} />
      <CollegeBottomSheet {...props} />
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  const college = await getCollegeDetailData();
  console.log(college);

  return {
    props: {
      ...college,
    },
  };
}
