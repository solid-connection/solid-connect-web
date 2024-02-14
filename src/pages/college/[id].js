import Head from "next/head";

import { getCollegeDetailData } from "../api/college/[id]";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeDetail from "@/components/college/detail/college-detail";
import CollegeBottomSheet from "@/components/college/detail/college-bottomsheet";

export default function CollegeDetailPage(props) {
  const { collegeData } = props;
  return (
    <>
      <Head>
        <title>{collegeData.koreanName || "대학명"}</title>
      </Head>
      <TopDetailNavigation title={collegeData.koreanName || "대학명"} />
      <CollegeDetail imageUrl={collegeData.backgroundImageUrl && `https://solid-connection.s3.ap-northeast-2.amazonaws.com/resize/${collegeData.formatName}/1.webp`} name={collegeData.koreanName || "대학명"} />
      <CollegeBottomSheet {...collegeData} />
    </>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const { id } = params;
  try {
    const response = await getCollegeDetailData(id);
    console.log(response);
    if (!response.success) {
      throw new Error(response);
    }
    return {
      props: {
        collegeData: response.data,
      },
      revalidate: 600,
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
