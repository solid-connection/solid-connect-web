import Link from "next/link";

import Image from "@/components/ui/FallbackImage";
import UniversityZoneLink from "@/components/ui/UniversityZoneLink";
import { getHomeUniversitySlugByName, HOME_UNIVERSITY_LIST, isMatchedHomeUniversityName } from "@/constants/university";
import { IconLoveLetter, IconRightArrow } from "@/public/svgs/home";
import { IconDirectionRight } from "@/public/svgs/mentor";
import type { News } from "@/types/news";
import { type AllRegionsUniversityList, type ListUniversity, RegionEnumExtend } from "@/types/university";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import shortenLanguageTestName from "@/utils/universityUtils";
import HomeDesktopEntryPanel from "./HomeDesktopEntryPanel";

type HomeDesktopViewProps = {
  recommendedUniversities: ListUniversity[];
  allRegionsUniversityList: AllRegionsUniversityList;
  newsList: News[];
};

const POPULAR_UNIVERSITY_COUNT = 6;
const PREVIEW_UNIVERSITY_COUNT = 6;

const getUniversityHref = (university: ListUniversity) => {
  const homeUniversitySlug = getHomeUniversitySlugByName(university.homeUniversityName);

  return homeUniversitySlug ? `/university/${homeUniversitySlug}/${university.id}` : "/university";
};

const getLanguageRequirementText = (university: ListUniversity) => {
  const [firstRequirement] = university.languageRequirements;

  if (!firstRequirement) {
    return "어학 조건 없음";
  }

  const testName = shortenLanguageTestName(firstRequirement.languageTestType) ?? firstRequirement.languageTestType;

  return `${testName} ${firstRequirement.minScore}`;
};

const HomeDesktopView = ({ recommendedUniversities, allRegionsUniversityList, newsList }: HomeDesktopViewProps) => {
  const allUniversities = allRegionsUniversityList[RegionEnumExtend.ALL] ?? [];
  const countryCount = new Set(allUniversities.map((university) => university.country)).size;
  const popularUniversities = recommendedUniversities.slice(0, POPULAR_UNIVERSITY_COUNT);
  const previewUniversities = allUniversities.slice(0, PREVIEW_UNIVERSITY_COUNT);
  const universityCountsByHome = HOME_UNIVERSITY_LIST.map((homeUniversity) => ({
    ...homeUniversity,
    count: allUniversities.filter((university) =>
      isMatchedHomeUniversityName(university.homeUniversityName, homeUniversity.name),
    ).length,
  }));

  return (
    <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-primary typo-sb-9">Solid Connection</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">교환학생 준비</h1>
          <p className="mt-2 max-w-2xl text-k-500 typo-medium-2">
            파견학교 탐색부터 성적 입력, 지원 현황까지 한 화면에서 이어갈 수 있어요.
          </p>
        </div>

        <UniversityZoneLink
          href="/university"
          className="flex items-center gap-2 rounded-lg border border-k-100 bg-white px-4 py-3 text-k-700 transition-colors typo-sb-9 hover:border-primary hover:text-primary"
        >
          전체 파견학교
          <IconDirectionRight className="h-4 w-4" />
        </UniversityZoneLink>
      </header>

      <div className="grid grid-cols-[minmax(280px,340px)_minmax(0,1fr)] items-start gap-8 xl:grid-cols-[minmax(320px,390px)_minmax(0,1fr)]">
        <aside className="sticky top-8 space-y-5">
          <HomeDesktopEntryPanel />

          <section className="rounded-lg border border-k-100 bg-white p-6">
            <h2 className="text-k-900 typo-bold-4">학교 현황</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-k-50 p-4">
                <span className="text-k-500 typo-medium-5">전체 학교</span>
                <strong className="mt-2 block text-k-900 typo-bold-1">{allUniversities.length}</strong>
              </div>
              <div className="rounded-lg bg-primary-100 p-4">
                <span className="text-primary typo-medium-5">국가</span>
                <strong className="mt-2 block text-primary-900 typo-bold-1">{countryCount}</strong>
              </div>
            </div>
            <div className="mt-4 divide-y divide-k-50">
              {universityCountsByHome.map((homeUniversity) => (
                <UniversityZoneLink
                  key={homeUniversity.slug}
                  href={`/university/${homeUniversity.slug}`}
                  className="flex items-center justify-between py-3 text-k-700 hover:text-primary"
                >
                  <span className="typo-medium-3">{homeUniversity.name}</span>
                  <span className="typo-sb-9">{homeUniversity.count}개</span>
                </UniversityZoneLink>
              ))}
            </div>
          </section>
        </aside>

        <main className="min-w-0 space-y-8">
          <section>
            <SectionHeader title="실시간 인기있는 파견학교" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
              {popularUniversities.map((university, index) => (
                <UniversityZoneLink
                  key={university.id}
                  href={getUniversityHref(university)}
                  className="group overflow-hidden rounded-lg border border-k-100 bg-white transition-transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
                >
                  <div className="relative h-40 bg-k-100">
                    <Image
                      alt={`${university.koreanName} 배경 이미지`}
                      src={normalizeImageUrlToUploadCdn(university.backgroundImageUrl)}
                      fill
                      className="object-cover"
                      fallbackSrc="/svgs/placeholders/university-background-placeholder.svg"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-k-700 typo-sb-11">
                      {university.country}
                    </span>
                  </div>
                  <div className="min-h-28 p-4">
                    <h3 className="truncate text-k-900 typo-bold-5" title={university.koreanName}>
                      {university.koreanName}
                    </h3>
                    <p className="mt-1 text-k-500 typo-medium-5">{university.region}</p>
                    <p className="mt-3 text-primary typo-sb-11">{getLanguageRequirementText(university)}</p>
                  </div>
                </UniversityZoneLink>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="전체 학교 리스트" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {previewUniversities.map((university) => (
                <UniversityZoneLink
                  key={university.id}
                  href={getUniversityHref(university)}
                  className="flex min-w-0 items-center gap-4 rounded-lg border border-k-100 bg-white p-4 transition-transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
                >
                  <Image
                    className="h-14 w-14 shrink-0 rounded-full border border-k-50 object-cover"
                    src={normalizeImageUrlToUploadCdn(university.logoImageUrl)}
                    width={56}
                    height={56}
                    alt={`${university.koreanName} 로고`}
                    fallbackSrc="/svgs/placeholders/university-logo-placeholder.svg"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-k-900 typo-bold-5" title={university.koreanName}>
                      {university.koreanName}
                    </h3>
                    <p className="mt-1 truncate text-k-500 typo-medium-5">
                      {university.country} · {university.region}
                    </p>
                    <p className="mt-2 text-primary typo-sb-11">모집 {university.studentCapacity}명</p>
                  </div>
                </UniversityZoneLink>
              ))}
            </div>
          </section>

          <section className="pb-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-k-900 typo-bold-4">솔커에서 맛보는 소식</h2>
                <IconLoveLetter />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {newsList.map((news) => (
                <Link
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-lg border border-k-100 bg-white transition-transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
                >
                  <Image
                    loading="lazy"
                    className="h-36 w-full object-cover"
                    src={news.imageUrl}
                    cdnHostType="default"
                    alt={news.title}
                    width={360}
                    height={144}
                  />
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-k-900 typo-bold-5">{news.title}</h3>
                    <p className="mt-2 line-clamp-2 text-k-500 typo-medium-4">{news.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-k-900 typo-bold-4">{title}</h2>
      <UniversityZoneLink
        href="/university"
        className="flex items-center gap-1 text-k-500 typo-sb-9 hover:text-primary"
      >
        더보기
        <IconRightArrow className="h-4 w-4" />
      </UniversityZoneLink>
    </div>
  );
};

export default HomeDesktopView;
