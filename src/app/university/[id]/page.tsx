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

  if (!universityData) {
    return {
      title: "파견 학교 상세",
    };
  }

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

  const universityData = await getUniversityDetail(collegeId);

  if (!universityData) {
    notFound();
  }

  const convertedKoreanName =
    universityData.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${universityData.koreanName}(${universityData.term})`
      : universityData.koreanName;

  return (
    <>
      <TopDetailNavigation title={convertedKoreanName} />
      <div className="w-full px-5">
        <UniversityDetail koreanName={convertedKoreanName} university={universityData} />
      </div>
    </>
  );
};

export default CollegeDetailPage;
