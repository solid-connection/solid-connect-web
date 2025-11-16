import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import UniversityDetail from "./UniversityDetail";

import { getUniversityDetail } from "@/api/university/server/getUniversityDetail";
import { getAllUniversities } from "@/api/university/server/getSearchUniversitiesByText";

export const revalidate = false;

export async function generateStaticParams() {
  const universities = await getAllUniversities();

  return universities.map((university) => ({
    id: String(university.id),
  }));
}

type MetadataProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: MetadataProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;

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
      <UniversityDetail koreanName={convertedKoreanName} university={universityData} />
    </>
  );
};

export default CollegeDetailPage;
