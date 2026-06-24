import Image from "@/components/ui/FallbackImage";
import LinkifyText from "@/components/ui/LinkifyText";
import type { University } from "@/types/university";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import InfoSection from "./_ui/InfoSection";
import LanguageSection from "./_ui/LanguageSection";
import MapSection from "./_ui/MapSection";
import TitleSection from "./_ui/TitleSection";
import UniversityBtns from "./_ui/UniversityBtns";

interface UniversityDetailProps {
  university: University;
  koreanName: string;
}

const UniversityDetail = ({ university, koreanName }: UniversityDetailProps) => {
  return (
    <>
      <div className="md:hidden">
        <UniversityDetailMobile university={university} koreanName={koreanName} />
      </div>
      <div className="hidden md:block">
        <UniversityDetailDesktop university={university} koreanName={koreanName} />
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

      <div className="relative -z-10 h-60 w-full bg-gradient-to-b from-k-700 to-k-900">
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

const UniversityDetailDesktop = ({ university, koreanName }: UniversityDetailProps) => {
  return (
    <div className="min-h-screen bg-k-50">
      <section className="relative h-[360px] bg-gradient-to-b from-k-700 to-k-900">
        <Image
          alt="대학 이미지"
          src={normalizeImageUrlToUploadCdn(university.backgroundImageUrl)}
          fill
          className="object-cover"
          fallbackSrc="/svgs/placeholders/image-placeholder.svg"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />
        <div className="absolute right-8 top-8 z-20 flex justify-end gap-3 lg:right-10">
          <UniversityBtns universityId={university.id} />
        </div>
      </section>

      <main className="relative -mt-24 px-8 pb-16 lg:px-10">
        <div className="grid grid-cols-[minmax(330px,430px)_minmax(0,1fr)] items-start gap-8">
          <aside className="sticky top-8 rounded-lg border border-k-100 bg-white px-6 pb-2 shadow-sm">
            <TitleSection
              title={koreanName}
              subTitle={university.englishName}
              logoUrl={normalizeImageUrlToUploadCdn(university.logoImageUrl)}
            />
            <UniversityStats university={university} />
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
          </aside>

          <section className="min-w-0 rounded-lg border border-k-100 bg-white p-6 shadow-sm">
            <header className="mb-7 border-b border-k-50 pb-5">
              <p className="text-primary typo-sb-9">{university.country}</p>
              <h2 className="mt-2 text-k-900 typo-bold-2">상세 정보</h2>
              <p className="mt-2 text-k-500 typo-medium-3">
                전공, 영어 강의, 위치 정보를 확인하고 지원 가능 여부를 판단해보세요.
              </p>
            </header>
            <UniversityDetailTexts university={university} />
            <MapSection universityEnglishName={university.englishName} />
          </section>
        </div>
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
    <span className="px-[30px] text-k-900 typo-sb-9">0회 파견</span>
    <span className="px-[30px] text-k-900 typo-sb-9">{university.country}</span>
    <span className="px-[30px] text-k-900 typo-sb-9">모집 {university.studentCapacity}명</span>
  </div>
);

const UniversityDetailTexts = ({ university }: { university: University }) => (
  <div className="min-w-0">
    <DetailTextSection title="전공상세">{university.detailsForMajor}</DetailTextSection>
    <DetailTextSection title="영어강의 리스트">{university.detailsForEnglishCourse}</DetailTextSection>
  </div>
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
