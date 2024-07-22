import Head from "next/head";

import { getUniversityDetailPublicApi } from "@/services/university";

import CollegeBottomSheet from "@/components/college/detail/college-bottomsheet";
import CollegeDetail from "@/components/college/detail/college-detail";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";

import { Review } from "@/types/review";
import { UniversityPersonal } from "@/types/university";

export default function CollegeDetailPage({
  collegeId,
  collegeData,
  reviewList,
}: {
  collegeId: number;
  collegeData: UniversityPersonal;
  reviewList: Review[];
}) {
  const convertedKoreanName =
    collegeData.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${collegeData.koreanName}(${collegeData.term})`
      : collegeData.koreanName;
  return (
    <>
      <Head>
        <title>{convertedKoreanName || "대학명"}</title>
      </Head>
      <TopDetailNavigation title={convertedKoreanName || "대학명"} />
      <CollegeDetail imageUrl={collegeData.backgroundImageUrl} name={convertedKoreanName || "대학명"} />
      <CollegeBottomSheet
        collegeId={collegeId}
        {...collegeData}
        convertedKoreanName={convertedKoreanName}
        reviewList={reviewList}
      />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { id }: { id: number } = params;
  const reviewList: Review[] = [];
  try {
    const res = await getUniversityDetailPublicApi(id);
    return {
      props: {
        collegeId: id,
        collegeData: res.data,
        reviewList,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}
