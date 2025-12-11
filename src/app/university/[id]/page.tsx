import { Metadata } from "next";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import UniversityDetail from "./_ui/UniversityDetail";

import { getAllUniversities } from "@/api/university/server/getSearchUniversitiesByText";
import { getUniversityDetail } from "@/api/university/server/getUniversityDetail";

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

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
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

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://solid-connection.com";
  const pageUrl = `${baseUrl}/university/${id}`;
  const imageUrl = universityData.backgroundImageUrl
    ? universityData.backgroundImageUrl.startsWith("http")
      ? universityData.backgroundImageUrl
      : `${baseUrl}${universityData.backgroundImageUrl}`
    : `${baseUrl}/images/default-university.jpg`;

  // Description 생성: 간결하게 핵심 정보만 포함 (150자 이내 권장)
  const description = `${convertedKoreanName}(${universityData.englishName}) 교환학생 프로그램. ${universityData.country} ${universityData.studentCapacity}명 모집. 솔리드커넥션에서 지원 정보 확인.`;

  return {
    title: `${convertedKoreanName} - ${universityData.englishName} 교환학생 정보 | 솔리드커넥션`,
    description,
    openGraph: {
      title: `${convertedKoreanName} - ${universityData.englishName} 교환학생 정보`,
      description,
      url: pageUrl,
      siteName: "솔리드커넥션",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${convertedKoreanName} 대학 이미지`,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${convertedKoreanName} - ${universityData.englishName} 교환학생 정보`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
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

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://solid-connection.com";
  const pageUrl = `${baseUrl}/university/${collegeId}`;

  // Structured Data (JSON-LD) for SEO - 검색 엔진이 대학 정보를 더 잘 이해하도록
  const structuredData: {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    description: string;
    image: string;
  } = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: convertedKoreanName,
    url: pageUrl,
    description: `${convertedKoreanName}(${universityData.englishName}) 교환학생 프로그램 정보`,
    image: universityData.backgroundImageUrl
      ? universityData.backgroundImageUrl.startsWith("http")
        ? universityData.backgroundImageUrl
        : `${baseUrl}${universityData.backgroundImageUrl}`
      : `${baseUrl}/images/article-thumb.png`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <TopDetailNavigation title={convertedKoreanName} />
      <div className="w-full px-5">
        <UniversityDetail koreanName={convertedKoreanName} university={universityData} />
      </div>
    </>
  );
};

export default CollegeDetailPage;
