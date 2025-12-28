import { Metadata } from "next";
import { notFound } from "next/navigation";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import UniversityDetail from "./_ui/UniversityDetail";

import { getAllUniversities, getUniversityDetail } from "@/apis/universities/server";

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
    : `${baseUrl}/images/article-thumb.png`;

  // [나라] 교환학생 키워드 생성
  const countryExchangeKeyword = `${universityData.country} 교환학생`;

  // Description 생성: 대학교 이름과 [나라] 교환학생 키워드 포함
  const description = `${convertedKoreanName}(${universityData.englishName}) ${countryExchangeKeyword} 프로그램. 모집인원 ${universityData.studentCapacity}명. 솔리드커넥션에서 ${convertedKoreanName} ${countryExchangeKeyword} 지원 정보 확인.`;

  // Title 생성: 대학교 이름과 [나라] 교환학생 키워드 포함 (검색 최적화)
  const title = `${convertedKoreanName} - ${countryExchangeKeyword} 정보 | 솔리드커넥션`;

  return {
    title,
    description,
    openGraph: {
      title,
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
      title,
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

  // [나라] 교환학생 키워드 생성
  const countryExchangeKeyword = `${universityData.country} 교환학생`;

  // Structured Data (JSON-LD) for SEO - 검색 엔진이 대학 정보를 더 잘 이해하도록
  const structuredData: {
    "@context": string;
    "@type": string;
    name: string;
    alternateName?: string;
    url: string;
    description: string;
    image: string;
  } = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: convertedKoreanName,
    alternateName: universityData.englishName,
    url: pageUrl,
    description: `${convertedKoreanName}(${universityData.englishName}) ${countryExchangeKeyword} 프로그램 정보`,
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
