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

  // 언어 요건 요약
  const languageSummary = universityData.languageRequirements
    .map((req) => `${req.languageTestType} ${req.minScore}`)
    .join(", ");

  // Description 생성: 대학 이름, 국가, 모집인원, 학기, 언어요건 등 핵심 정보 포함
  const description = `${convertedKoreanName}(${universityData.englishName}) 교환학생 프로그램 정보. 국가: ${universityData.country}, 모집인원: ${universityData.studentCapacity}명, 파견가능학기: ${universityData.semesterAvailableForDispatch}${languageSummary ? `, 어학요건: ${languageSummary}` : ""}. 솔리드커넥션에서 ${convertedKoreanName} 교환학생 지원 정보를 확인하세요.`;

  // Keywords: 대학 이름, 영어 이름, 국가, 교환학생, 파견 등 검색 키워드
  const keywords = [
    convertedKoreanName,
    universityData.englishName,
    universityData.koreanName,
    `${universityData.country} 교환학생`,
    `${universityData.country} 파견`,
    "교환학생",
    "파견학교",
    "교환학생 프로그램",
    universityData.region,
    universityData.semesterAvailableForDispatch,
  ].filter(Boolean);

  return {
    title: `${convertedKoreanName} - ${universityData.englishName} 교환학생 정보 | 솔리드커넥션`,
    description,
    keywords: keywords.join(", "),
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
    other: {
      "geo.region": universityData.country,
      "geo.placename": universityData.country,
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: convertedKoreanName,
    alternateName: universityData.englishName,
    url: universityData.homepageUrl || pageUrl,
    address: {
      "@type": "PostalAddress",
      addressCountry: universityData.country,
      addressRegion: universityData.region,
    },
    description: `${convertedKoreanName}(${universityData.englishName}) 교환학생 프로그램 정보`,
    image: universityData.backgroundImageUrl
      ? universityData.backgroundImageUrl.startsWith("http")
        ? universityData.backgroundImageUrl
        : `${baseUrl}${universityData.backgroundImageUrl}`
      : undefined,
    sameAs: universityData.homepageUrl ? [universityData.homepageUrl] : undefined,
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
