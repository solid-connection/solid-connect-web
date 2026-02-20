import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllUniversities, getUniversityDetail, getUniversityDetailWithStatus } from "@/apis/universities/server";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { getHomeUniversityBySlug, HOME_UNIVERSITY_SLUGS, isMatchedHomeUniversityName } from "@/constants/university";
import type { HomeUniversitySlug } from "@/types/university";

// UniversityDetail 컴포넌트
import UniversityDetail from "./_ui/UniversityDetail";
import UniversityDetailPreparingFallback from "./_ui/UniversityDetailPreparingFallback";

export const revalidate = false; // 완전 정적 생성

// 모든 homeUniversity + id 조합에 대해 정적 경로 생성
export async function generateStaticParams() {
  const universities = await getAllUniversities();

  const params: { homeUniversity: string; id: string }[] = [];

  // 각 대학에 대해 모든 homeUniversity 슬러그와 조합
  for (const slug of HOME_UNIVERSITY_SLUGS) {
    const homeUniversityInfo = getHomeUniversityBySlug(slug);
    if (!homeUniversityInfo) continue;

    // 해당 홈대학에 속하는 대학들만 필터링
    const filteredUniversities = universities.filter((uni) =>
      isMatchedHomeUniversityName(uni.homeUniversityName, homeUniversityInfo.name),
    );

    for (const university of filteredUniversities) {
      params.push({
        homeUniversity: slug,
        id: String(university.id),
      });
    }
  }

  return params;
}

type PageProps = {
  params: Promise<{ homeUniversity: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { homeUniversity, id } = await params;

  // 유효한 슬러그인지 확인
  if (!HOME_UNIVERSITY_SLUGS.includes(homeUniversity as HomeUniversitySlug)) {
    return { title: "파견 학교 상세" };
  }

  const universityData = await getUniversityDetail(Number(id));

  if (!universityData) {
    return { title: "파견 학교 상세" };
  }

  const homeUniversityInfo = getHomeUniversityBySlug(homeUniversity);
  const convertedKoreanName = universityData.koreanName;

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://solid-connection.com";
  const pageUrl = `${baseUrl}/university/${homeUniversity}/${id}`;
  const imageUrl = universityData.backgroundImageUrl
    ? universityData.backgroundImageUrl.startsWith("http")
      ? universityData.backgroundImageUrl
      : `${baseUrl}${universityData.backgroundImageUrl}`
    : `${baseUrl}/images/article-thumb.png`;

  const countryExchangeKeyword = `${universityData.country} 교환학생`;
  const description = `${convertedKoreanName}(${universityData.englishName}) ${countryExchangeKeyword} 프로그램. 모집인원 ${universityData.studentCapacity}명. ${homeUniversityInfo?.shortName || ""} 학생을 위한 교환학생 정보.`;
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

const CollegeDetailPage = async ({ params }: PageProps) => {
  const { homeUniversity, id } = await params;

  // 유효한 슬러그인지 확인
  if (!HOME_UNIVERSITY_SLUGS.includes(homeUniversity as HomeUniversitySlug)) {
    notFound();
  }

  const homeUniversityInfo = getHomeUniversityBySlug(homeUniversity);
  if (!homeUniversityInfo) {
    notFound();
  }

  const collegeId = Number(id);
  if (Number.isNaN(collegeId)) {
    notFound();
  }

  const universityDetailResult = await getUniversityDetailWithStatus(collegeId);

  if (!universityDetailResult.ok) {
    const isNotFoundError = universityDetailResult.status === 404;

    return (
      <>
        <TopDetailNavigation title="파견 학교 상세" backHref={`/university/${homeUniversity}`} />
        <UniversityDetailPreparingFallback
          backHref={`/university/${homeUniversity}`}
          title={isNotFoundError ? "해당 대학 정보를 찾을 수 없어요." : undefined}
          description={
            isNotFoundError ? "요청하신 파견학교를 찾지 못했습니다. 목록에서 다른 학교를 선택해 주세요." : undefined
          }
        />
      </>
    );
  }

  const universityData = universityDetailResult.data;

  const convertedKoreanName = universityData.koreanName;

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://solid-connection.com";
  const pageUrl = `${baseUrl}/university/${homeUniversity}/${collegeId}`;
  const countryExchangeKeyword = `${universityData.country} 교환학생`;

  const structuredData = {
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
      <TopDetailNavigation title={convertedKoreanName} backHref={`/university/${homeUniversity}`} />
      <div className="w-full px-5">
        <UniversityDetail koreanName={convertedKoreanName} university={universityData} />
      </div>
    </>
  );
};

export default CollegeDetailPage;
