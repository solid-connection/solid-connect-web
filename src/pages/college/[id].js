import Image from "next/image";
import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeDetail from "../../components/college/detail/college-detail";
import CollegeBottomSheet from "../../components/college/detail/college-bottomsheet";
import { getCollegeDetailData } from "../api/college/[id]";

export default function CollegeDetailPage(props) {
  return (
    <>
      <Head>
        <title>{props.name}</title>
      </Head>
      <TopDetailNavigation title={props.name} />
      <CollegeDetail image={props.image} name={props.name} />
      <CollegeBottomSheet {...props} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  const college = await getCollegeDetailData(id);

  return {
    props: {
      ...college,
    },
  };
}
