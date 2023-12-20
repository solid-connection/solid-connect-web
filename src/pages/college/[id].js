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
    props: { id: 1, name: "보라스 대학교", country: "스웨덴", region: "예톄보리", requirements: "토익 775 토플 90", image: "https://basak-image-bucket.s3.ap-northeast-2.amazonaws.com/restaurant_thumbnails/5c2cfa97-962b-41c3-9cb8-19e71b39ba58.png" },
  };
}

export const runtime = "experimental-edge";
