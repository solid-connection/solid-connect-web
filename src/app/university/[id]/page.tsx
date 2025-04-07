import { Metadata, ResolvingMetadata } from "next";
import Head from "next/head";
import { notFound } from "next/navigation";

import { getUniversityDetailPublicApi } from "@/services/university";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import CollegeBottomSheet from "./CollegeBottomsheet";
import CollegeDetail from "./CollegeDetail";

import { Review } from "@/types/review";
import { University } from "@/types/university";

export const revalidate = 60; // ISR 재생성 주기 설정

type MetadataProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: MetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { id } = await params;

  // fetch data
  const res = await getUniversityDetailPublicApi(Number(id));
  const collegeData = res.data;
  const convertedKoreanName =
    collegeData.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${collegeData.koreanName}(${collegeData.term})`
      : collegeData.koreanName;

  return {
    title: convertedKoreanName,
  };
}

type CollegeDetailPageProps = {
  params: { id: string };
};

const CollegeDetailPage = async ({ params }: CollegeDetailPageProps) => {
  const collegeId = Number(params.id);
  const reviewList: Review[] = [];

  let res: { data: University };
  try {
    res = await getUniversityDetailPublicApi(collegeId);
  } catch {
    notFound(); // 404 페이지로 이동
  }

  const collegeData = res.data;
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
      <CollegeDetail imageUrl={collegeData.backgroundImageUrl} />
      <CollegeBottomSheet
        collegeId={collegeId}
        university={collegeData}
        convertedKoreanName={convertedKoreanName}
        reviewList={reviewList}
      />
    </>
  );
};

export default CollegeDetailPage;
