import { CollegePersonal } from "@/types/college";
import Head from "next/head";

import { Review } from "@/types/review";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeDetail from "@/components/college/detail/college-detail";
import CollegeBottomSheet from "@/components/college/detail/college-bottomsheet";
import axios from "axios";

export default function CollegeDetailPage({ collegeId, collegeData, reviewList }: { collegeId: number; collegeData: CollegePersonal; reviewList: Review[] }) {
  const convertedKoreanName = collegeData.term !== process.env.NEXT_PUBLIC_CURRENT_TERM ? `${collegeData.koreanName}(${collegeData.term})` : collegeData.koreanName;
  return (
    <>
      <Head>
        <title>{convertedKoreanName || "대학명"}</title>
      </Head>
      <TopDetailNavigation title={convertedKoreanName || "대학명"} />
      <CollegeDetail imageUrl={collegeData.backgroundImageUrl} name={convertedKoreanName || "대학명"} />
      <CollegeBottomSheet collegeId={collegeId} {...collegeData} convertedKoreanName={convertedKoreanName} reviewList={reviewList} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { id }: { id: number } = params;
  const reviewList: Review[] = [];
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/university/detail/${id}`);
  return {
    props: {
      collegeId: id,
      collegeData: response.data.data,
      reviewList,
    },
  };
}
