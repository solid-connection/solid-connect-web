import Link from "next/link";

import Image from "@/components/ui/FallbackImage";
import LinkifyText from "@/components/ui/LinkifyText";
import type { University } from "@/types/university";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import { formatLanguageTestName, getLanguageTestLogo } from "@/utils/languageUtils";
import InfoSection from "./_ui/InfoSection";
import LanguageSection from "./_ui/LanguageSection";
import MapSection from "./_ui/MapSection";
import TitleSection from "./_ui/TitleSection";
import UniversityBtns from "./_ui/UniversityBtns";

interface UniversityDetailProps {
  university: University;
  koreanName: string;
  backHref?: string;
}

const getCapacityValue = (university: University) => {
  if (university.studentCapacity === null || university.studentCapacity === undefined) {
    return "미정";
  }

  return `${university.studentCapacity}명`;
};

const getCapacityLabel = (university: University) => {
  if (university.studentCapacity === null || university.studentCapacity === undefined) {
    return "모집 인원 미정";
  }

  return `모집 ${university.studentCapacity}명`;
};

const UniversityDetail = ({ university, koreanName, backHref }: UniversityDetailProps) => {
  return (
    <>
      <div className="md:hidden">
        <UniversityDetailMobile university={university} koreanName={koreanName} />
      </div>
      <div className="hidden md:block">
        <UniversityDetailDesktop university={university} koreanName={koreanName} backHref={backHref} />
      </div>
    </>
  );
};

const UniversityDetailMobile = ({ university, koreanName }: UniversityDetailProps) => {
  return (
    <div className="relative">
      <div className="absolute top-4 z-20 flex w-full justify-between gap-3 px-5">
        <UniversityBtns universityId={university.id} />
      </div>

      <div className="relative h-60 w-full bg-gradient-to-b from-k-700 to-k-900">
        <Image
          alt="대학 이미지"
          src={normalizeImageUrlToUploadCdn(university.backgroundImageUrl)}
          fill
          className="object-cover"
          fallbackSrc="/svgs/placeholders/image-placeholder.svg"
        />
      </div>
      <div className="relative z-10 -mt-16 rounded-t-3xl bg-white px-5">
        <TitleSection
          title={koreanName}
          subTitle={university.englishName}
          logoUrl={normalizeImageUrlToUploadCdn(university.logoImageUrl)}
        />
        <UniversityStats university={university} />
        <UniversityDetailBody university={university} />
        <div className="h-48" />
      </div>
    </div>
  );
};

const UniversityDetailDesktop = ({ university, koreanName, backHref = "/university" }: UniversityDetailProps) => {
  return (
    <div className="min-h-screen bg-k-50">
      <section className="relative h-[380px] bg-gradient-to-b from-k-700 to-k-900">
        <Image
          alt="대학 이미지"
          src={normalizeImageUrlToUploadCdn(university.backgroundImageUrl)}
          fill
          className="object-cover"
          fallbackSrc="/svgs/placeholders/image-placeholder.svg"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/35" />
        <Link
          href={backHref}
          className="absolute left-8 top-8 z-20 rounded-lg border border-white/30 bg-black/20 px-4 py-2 text-white backdrop-blur-sm transition-colors typo-sb-9 hover:bg-white/15 lg:left-10"
        >
          목록으로 돌아가기
        </Link>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end justify-between gap-8 px-8 pb-12 lg:px-10">
          <div className="min-w-0">
            <p className="text-white/80 typo-sb-9">
              {university.country} · {university.region}
            </p>
            <h1 className="mt-3 max-w-4xl break-keep text-white typo-bold-1">{koreanName}</h1>
            <p className="mt-2 max-w-4xl break-words text-white/80 typo-medium-2">{university.englishName}</p>
          </div>
          <div className="mb-1 flex shrink-0 gap-3">
            <UniversityBtns universityId={university.id} />
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_360px] items-start gap-8 px-8 pb-16 pt-8 lg:px-10">
        <section className="min-w-0 space-y-6">
          <DesktopOverviewSection university={university} />
          <DesktopDetailTexts university={university} />
          <MapSection universityEnglishName={university.englishName} variant="desktop" />
        </section>

        <aside className="desktop-sticky-panel space-y-5">
          <DesktopUniversitySummary university={university} koreanName={koreanName} />
          <DesktopLanguageSummary university={university} />
          <DesktopRequirementSummary university={university} />
        </aside>
      </main>
    </div>
  );
};

const UniversityDetailBody = ({ university }: { university: University }) => (
  <>
    <LanguageSection
      detailsForLanguage={university.detailsForLanguage}
      languageRequirements={university.languageRequirements}
    />
    <InfoSection
      semesterRequirement={university.semesterRequirement}
      semesterAvailableForDispatch={university.semesterAvailableForDispatch}
      detailsForApply={university.detailsForApply}
      detailsForAccommodation={university.detailsForAccommodation}
    />
    <UniversityDetailTexts university={university} />
    <MapSection universityEnglishName={university.englishName} />
  </>
);

const UniversityStats = ({ university }: { university: University }) => (
  <div className="mb-7 mt-10 flex justify-center divide-x divide-k-100">
    <span className="px-[30px] text-k-900 typo-sb-9">{university.country}</span>
    <span className="px-[30px] text-k-900 typo-sb-9">{getCapacityLabel(university)}</span>
  </div>
);

const DesktopUniversitySummary = ({ university, koreanName }: UniversityDetailProps) => (
  <section className="rounded-lg border border-k-100 bg-white p-6 shadow-sm">
    <div className="flex min-w-0 gap-3">
      <Image
        src={normalizeImageUrlToUploadCdn(university.logoImageUrl)}
        alt="대학 로고"
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-full border border-k-50 object-cover"
        fallbackSrc="/svgs/placeholders/university-logo-placeholder.svg"
      />
      <div className="min-w-0">
        <h2 className="truncate text-k-900 typo-sb-4" title={koreanName}>
          {koreanName}
        </h2>
        <p className="mt-1 truncate text-k-400 typo-medium-2" title={university.englishName}>
          {university.englishName}
        </p>
      </div>
    </div>

    <dl className="mt-6 grid grid-cols-2 gap-3">
      <DesktopStatItem label="국가" value={university.country} />
      <DesktopStatItem label="모집 인원" value={getCapacityValue(university)} />
      <DesktopStatItem label="파견 학기" value={university.semesterAvailableForDispatch} />
      <DesktopStatItem label="최저 학기" value={university.semesterRequirement} />
    </dl>
  </section>
);

const DesktopStatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-k-50 px-4 py-3">
    <dt className="text-k-400 typo-medium-5">{label}</dt>
    <dd className="mt-1 truncate text-k-900 typo-sb-9" title={value}>
      {value}
    </dd>
  </div>
);

const DesktopOverviewSection = ({ university }: { university: University }) => (
  <section className="rounded-lg border border-k-100 bg-white p-7 shadow-sm">
    <header className="border-b border-k-50 pb-5">
      <p className="text-primary typo-sb-9">Overview</p>
      <h2 className="mt-2 text-k-900 typo-bold-2">지원 전 확인할 정보</h2>
      <p className="mt-2 text-k-500 typo-medium-3">
        모집 규모, 등록금 유형, 성적 기준을 한 번에 확인하고 상세 요건으로 이어서 살펴보세요.
      </p>
    </header>

    <dl className="mt-6 grid gap-4 lg:grid-cols-3">
      <DesktopOverviewItem label="모집 인원" value={getCapacityValue(university)} />
      <DesktopOverviewItem label="등록금 납부 유형" value={university.tuitionFeeType} />
      <DesktopOverviewItem
        label="최저 성적"
        value={`${university.gpaRequirementCriteria} ${university.gpaRequirement}`}
      />
    </dl>
  </section>
);

const DesktopOverviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-k-100 bg-k-0 p-5">
    <dt className="text-k-400 typo-medium-4">{label}</dt>
    <dd className="mt-2 break-keep text-k-900 typo-sb-7">{value}</dd>
  </div>
);

const DesktopLanguageSummary = ({ university }: { university: University }) => (
  <section className="rounded-lg border border-k-100 bg-white p-6 shadow-sm">
    <h2 className="text-k-900 typo-bold-4">어학 성적</h2>
    <div className="mt-5 space-y-4">
      {university.languageRequirements.map((requirement, index) => (
        <div
          key={`${requirement.languageTestType}-${requirement.minScore}-${index}`}
          className="flex items-center justify-between gap-3 rounded-lg bg-k-50 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={getLanguageTestLogo(requirement.languageTestType)}
              alt="어학시험"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 object-contain"
              fallbackSrc="/images/language/default.png"
            />
            <span className="truncate text-k-800 typo-sb-10">
              {formatLanguageTestName(requirement.languageTestType)}
            </span>
          </div>
          <span className="shrink-0 text-secondary typo-sb-9">{requirement.minScore}</span>
        </div>
      ))}
    </div>
    <div className="mt-5 border-t border-k-50 pt-5">
      <p className="mb-2 text-k-900 typo-sb-9">세부 요건</p>
      <p className="break-words text-k-600 typo-medium-3">
        <LinkifyText>{university.detailsForLanguage}</LinkifyText>
      </p>
    </div>
  </section>
);

const DesktopRequirementSummary = ({ university }: { university: University }) => (
  <section className="rounded-lg border border-k-100 bg-white p-6 shadow-sm">
    <h2 className="text-k-900 typo-bold-4">지원 요건</h2>
    <div className="mt-5 space-y-5">
      <DesktopRequirementBlock title="자격요건">{university.detailsForApply}</DesktopRequirementBlock>
      <DesktopRequirementBlock title="기숙사">{university.detailsForAccommodation}</DesktopRequirementBlock>
    </div>
  </section>
);

const DesktopRequirementBlock = ({ title, children }: { title: string; children: string }) => (
  <div>
    <h3 className="mb-2 text-k-900 typo-sb-9">{title}</h3>
    <p className="break-words text-k-600 typo-medium-3">
      <LinkifyText>{children}</LinkifyText>
    </p>
  </div>
);

const UniversityDetailTexts = ({ university }: { university: University }) => (
  <div className="min-w-0">
    <DetailTextSection title="전공상세">{university.detailsForMajor}</DetailTextSection>
    <DetailTextSection title="영어강의 리스트">{university.detailsForEnglishCourse}</DetailTextSection>
  </div>
);

const DesktopDetailTexts = ({ university }: { university: University }) => (
  <section className="rounded-lg border border-k-100 bg-white p-7 shadow-sm">
    <header className="border-b border-k-50 pb-5">
      <p className="text-primary typo-sb-9">Details</p>
      <h2 className="mt-2 text-k-900 typo-bold-2">전공과 강의 정보</h2>
    </header>
    <div className="mt-6 grid gap-6">
      <DesktopTextSection title="전공상세">{university.detailsForMajor}</DesktopTextSection>
      <DesktopTextSection title="영어강의 리스트">{university.detailsForEnglishCourse}</DesktopTextSection>
    </div>
  </section>
);

const DesktopTextSection = ({ title, children }: { title: string; children: string }) => (
  <section>
    <h3 className="mb-3 text-k-900 typo-sb-7">{title}</h3>
    <div className="break-words rounded-lg bg-k-50 px-5 py-4 text-k-600 typo-medium-2">
      <LinkifyText>{children}</LinkifyText>
    </div>
  </section>
);

const DetailTextSection = ({ title, children }: { title: string; children: string }) => (
  <>
    <div className="h-1 bg-k-50" />
    <div className="my-7 px-3">
      <div className="mb-3 text-k-900 typo-sb-7">{title}</div>
      <div className="break-words text-k-600 typo-medium-2">
        <LinkifyText>{children}</LinkifyText>
      </div>
    </div>
  </>
);

export default UniversityDetail;
