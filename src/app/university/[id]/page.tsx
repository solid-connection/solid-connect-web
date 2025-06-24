import { Metadata, ResolvingMetadata } from "next";
import Head from "next/head";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import UniversityDetail from "./UniversityDetail";

import { Review } from "@/types/review";
import { University } from "@/types/university";

import { getUniversityDetailPublicApi } from "@/api/university";

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
  const universityData = res.data;
  const convertedKoreanName =
    universityData.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${universityData.koreanName}(${universityData.term})`
      : universityData.koreanName;

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

  const universityData = res.data;
  const convertedKoreanName =
    universityData.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${universityData.koreanName}(${universityData.term})`
      : universityData.koreanName;

  return (
    <>
      <Head>
        <title>{convertedKoreanName || "대학명"}</title>
      </Head>
      <TopDetailNavigation title={convertedKoreanName || "대학명"} />
      <UniversityDetail />
    </>
  );
};

export default CollegeDetailPage;
