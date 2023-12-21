import Image from "next/image";

import CollegeDetail from "../../components/college/detail/college-detail";
import CollegeBottomSheet from "../../components/college/detail/college-bottomsheet";
import { Fragment } from "react";

function CollegeDetailPage(props) {
  return (
    <Fragment>
      <CollegeDetail image={props.image} name={props.name} />
      <CollegeBottomSheet {...props} />
    </Fragment>
  );
}

export default CollegeDetailPage;

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  return {
    props: { id: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90", image: "/images/temp_1629768074308100.jpg" },
  };
}

export const runtime = "experimental-edge";
