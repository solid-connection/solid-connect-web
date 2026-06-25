import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllUniversities, getUniversityDetailWithStatus } from "@/apis/universities/server";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { getHomeUniversityBySlug, HOME_UNIVERSITY_SLUGS } from "@/constants/university";
import type { HomeUniversitySlug } from "@/types/university";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import { createUrl, NO_INDEX_ROBOTS } from "@/utils/seo";

// UniversityDetail 컴포넌트
import UniversityDetail from "./_ui/UniversityDetail";
import UniversityDetailPreparingFallback from "./_ui/UniversityDetailPreparingFallback";

export const revalidate = false;
export const dynamicParams = true;

// 모든 homeUniversity + id 조합에 대해 정적 경로 생성
export async function generateStaticParams() {
  const scopedUniversitiesBySlug = await Promise.all(
    HOME_UNIVERSITY_SLUGS.map(async (slug) => {
      const homeUniversityInfo = getHomeUniversityBySlug(slug);
      if (!homeUniversityInfo) {
        return { slug, universities: [] };
      }

      const universities = await getAllUniversities({
        homeUniversityId: homeUniversityInfo.homeUniversityId,
      });

      return { slug, universities };
    }),
  );

  return scopedUniversitiesBySlug.flatMap(({ slug, universities }) =>
    universities.map((university) => ({
      homeUniversity: slug,
      id: String(university.id),
    })),
  );
}

type PageProps = {
  params: Promise<{ homeUniversity: string; id: string }>;
};

const resolveMetadataImageUrl = (backgroundImageUrl: string | null | undefined) => {
  const normalizedImageUrl = normalizeImageUrlToUploadCdn(backgroundImageUrl);

  if (!normalizedImageUrl) {
    return createUrl("/images/article-thumb.png");
  }

  if (normalizedImageUrl.startsWith("http")) {
    return normalizedImageUrl;
  }

  return createUrl(normalizedImageUrl);
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { homeUniversity, id } = await params;

  // 유효한 슬러그인지 확인
  if (!HOME_UNIVERSITY_SLUGS.includes(homeUniversity as HomeUniversitySlug)) {
    return {
      title: "파견 학교 상세",
      robots: NO_INDEX_ROBOTS,
    };
  }

  const universityId = Number(id);

  if (Number.isNaN(universityId)) {
    return {
      title: "파견 학교 상세",
      robots: NO_INDEX_ROBOTS,
    };
  }

  const universityDetailResult = await getUniversityDetailWithStatus(universityId);

  if (!universityDetailResult.ok) {
    return {
      title: "파견 학교 상세",
      robots: NO_INDEX_ROBOTS,
    };
  }

  const universityData = universityDetailResult.data;

  const homeUniversityInfo = getHomeUniversityBySlug(homeUniversity);
  const convertedKoreanName = universityData.koreanName;

  const pageUrl = createUrl(`/university/${homeUniversity}/${id}`);
  const imageUrl = resolveMetadataImageUrl(universityData.backgroundImageUrl);

  const countryExchangeKeyword = `${universityData.country} 교환학생`;
  const capacityDescription =
    universityData.studentCapacity === null || universityData.studentCapacity === undefined
      ? "모집인원 미정"
      : `모집인원 ${universityData.studentCapacity}명`;
  const description = `${convertedKoreanName}(${universityData.englishName}) ${countryExchangeKeyword} 프로그램. ${capacityDescription}. ${homeUniversityInfo?.shortName || ""} 학생을 위한 교환학생 정보.`;
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
    if (universityDetailResult.status === 404) {
      notFound();
    }

    return (
      <>
        <TopDetailNavigation title="파견 학교 상세" backHref={`/university/${homeUniversity}`} />
        <UniversityDetailPreparingFallback backHref={`/university/${homeUniversity}`} />
      </>
    );
  }

  const universityData = universityDetailResult.data;

  const convertedKoreanName = universityData.koreanName;

  const pageUrl = createUrl(`/university/${homeUniversity}/${collegeId}`);
  const countryExchangeKeyword = `${universityData.country} 교환학생`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: convertedKoreanName,
    alternateName: universityData.englishName,
    url: pageUrl,
    description: `${convertedKoreanName}(${universityData.englishName}) ${countryExchangeKeyword} 프로그램 정보`,
    image: resolveMetadataImageUrl(universityData.backgroundImageUrl),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <TopDetailNavigation title={convertedKoreanName} backHref={`/university/${homeUniversity}`} />
      <div className="w-full">
        <UniversityDetail koreanName={convertedKoreanName} university={universityData} />
      </div>
    </>
  );
};

export default CollegeDetailPage;
