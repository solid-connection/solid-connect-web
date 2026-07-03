import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";
import ApplicationUniversityDetailContent from "./ApplicationUniversityDetailContent";

type ApplicationUniversityDetailPageProps = {
  params: Promise<{ universityName: string }>;
};

export const generateMetadata = async ({ params }: ApplicationUniversityDetailPageProps): Promise<Metadata> => {
  const { universityName } = await params;
  const decodedUniversityName = decodeUniversityNameParam(universityName);

  return {
    title: decodedUniversityName ? `${decodedUniversityName} 지원자 현황` : "지원자 현황 확인",
    robots: NO_INDEX_ROBOTS,
  };
};

const ApplicationUniversityDetailPage = async ({ params }: ApplicationUniversityDetailPageProps) => {
  const { universityName } = await params;
  const decodedUniversityName = decodeUniversityNameParam(universityName);

  if (!decodedUniversityName) {
    notFound();
  }

  const title = `${decodedUniversityName} 지원자 현황`;

  return (
    <>
      <TopDetailNavigation title={title} backHref="/university/application" />
      <ApplicationUniversityDetailContent universityName={decodedUniversityName} />
    </>
  );
};

const decodeUniversityNameParam = (universityName: string) => {
  try {
    return decodeURIComponent(universityName);
  } catch {
    return null;
  }
};

export default ApplicationUniversityDetailPage;
