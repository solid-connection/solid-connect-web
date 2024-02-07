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
      <CollegeDetail image={collegeData.backgroundImageUrl || `https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/${collegeData.formatName}/1.png`} name={collegeData.koreanName || "대학명"} />
      <CollegeBottomSheet {...collegeData} />
    </>
  );
}

// export async function getServerSideProps(context) {
//   const { params } = context;
//   const { id } = params;

//   const college = await getCollegeDetailData(id);

//   return {
//     props: {
//       collegeData: college,
//     },
//   };
// }

export async function getStaticProps(context) {
  const { params } = context;
  const { id } = params;

  const college = await getCollegeDetailData(id);

  return {
    props: {
      collegeData: college,
    },
    revalidate: 600,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
