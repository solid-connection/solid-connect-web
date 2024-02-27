import { CollegePersonal } from "@/types/college";
import Head from "next/head";
import createApiClient from "@/lib/serverApiClient";

import { Review } from "@/types/review";
import { getCollegeDetailData } from "../api/college/[id]";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeDetail from "@/components/college/detail/college-detail";
import CollegeBottomSheet from "@/components/college/detail/college-bottomsheet";

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

export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const apiClient = createApiClient(req, res);
  const { id }: { id: number } = params;
  const reviewList: Review[] = [
    // {
    //   id: 1,
    //   term: "2021년 1학기",
    //   rating: 4.5,
    //   content: "보라스는 중세에 거슬러 올라가는 역사를 자랑하는 스웨덴의 도시 중 하나입니다. 14세기에 건립된 보라스 성은 그 중요한 역사적 유적 중 하나로, 중세 건축 양식을 간직하고 있습니다. ",
    //   dispatchSemester: "2학기",
    //   transportation: "보통",
    //   buddyProgram: "없음",
    // },
  ];
  try {
    const response = await apiClient.get(`/university/detail/${id}`);
    return {
      props: {
        collegeId: id,
        collegeData: response.data.data,
        reviewList,
      },
    };
  } catch (error) {
    try {
      // 실패시 비로그인 상태로 재시도
      const response = await getCollegeDetailData(id);
      if (!response.success) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          collegeId: id,
          collegeData: response.data,
          reviewList,
        },
      };
    } catch (error) {
      return {
        notFound: true,
      };
    }
  }
}

// export async function getStaticProps(context) {
//   const { params } = context;
//   const { id } = params;
//   try {
//     const response = await getCollegeDetailData(id);
//     console.log(response);
//     if (!response.success) {
//       throw new Error(response);
//     }
//     return {
//       props: {
//         collegeData: response.data,
//       },
//       revalidate: 600,
//     };
//   } catch (e) {
//     return {
//       notFound: true,
//     };
//   }
// }

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// }
