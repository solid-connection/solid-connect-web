import Image from "next/image";

import CollegeDetail from "../../components/college/detail/college-detail";
import CollegeBottomSheet from "../../components/college/detail/college-bottomsheet";
import { Fragment } from "react";

export default function CollegeDetailPage(props) {
  return (
    <Fragment>
      <CollegeDetail image={props.image} name={props.name} />
      <CollegeBottomSheet {...props} />
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  const res = await fetch("http://localhost:3000/api/college/" + id);
  const data = await res.json();
  const college = data.college;

  return {
    props: {
      ...college,
    },
  };
}
