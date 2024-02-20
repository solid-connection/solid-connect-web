import { CollegePersonal } from "@/types/college";
import Head from "next/head";
import createApiClient from "@/lib/serverApiClient";

import { getCollegeDetailData } from "../api/college/[id]";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import CollegeDetail from "@/components/college/detail/college-detail";
import CollegeBottomSheet from "@/components/college/detail/college-bottomsheet";

export default function CollegeDetailPage({ collegeId, collegeData }: { collegeId: number; collegeData: CollegePersonal }) {
  const convertedKoreanName = collegeData.term !== process.env.NEXT_PUBLIC_CURRENT_TERM ? `${collegeData.koreanName}(${collegeData.term})` : collegeData.koreanName;
  return (
    <>
      <Head>
        <title>{convertedKoreanName || "대학명"}</title>
      </Head>
      <TopDetailNavigation title={convertedKoreanName || "대학명"} />
      <CollegeDetail imageUrl={collegeData.backgroundImageUrl} name={convertedKoreanName || "대학명"} />
      <CollegeBottomSheet collegeId={collegeId} {...collegeData} convertedKoreanName={convertedKoreanName} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const apiClient = createApiClient(req, res);
  const { id } = params;
  try {
    const response = await apiClient.get(`/university/detail/${id}`);
    const collegeData = response.data.data;
    return {
      props: {
        collegeId: id,
        collegeData,
      },
    };
  } catch (error) {
    try {
      const response = await getCollegeDetailData(id);
      if (!response.success) {
        return {
          notFound: true,
        };
      }

      const collegeData = response.data;
      return {
        props: {
          collegeId: id,
          collegeData,
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
