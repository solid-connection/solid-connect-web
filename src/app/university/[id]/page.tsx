import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import UniversityDetail from "./UniversityDetail";

import { University } from "@/types/university";

import { getUniversityDetail } from "@/api/university/server/getUniversityDetail";

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
  const universityData = await getUniversityDetail(Number(id));
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

  let universityData: University;
  try {
    universityData = await getUniversityDetail(collegeId);
  } catch {
    notFound(); // 404 페이지로 이동
  }
  const convertedKoreanName =
    universityData.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${universityData.koreanName}(${universityData.term})`
      : universityData.koreanName;

  return (
    <>
      <TopDetailNavigation title={convertedKoreanName} />
      <UniversityDetail koreanName={convertedKoreanName} university={universityData} />
    </>
  );
};

export default CollegeDetailPage;
