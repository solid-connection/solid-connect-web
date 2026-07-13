import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import CheveronRightFilled from "@/components/ui/icon/ChevronRightFilled";
import { getHomeUniversitySlugByName } from "@/constants/university";
import type { ListUniversity } from "@/types/university";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import shortenLanguageTestName from "@/utils/universityUtils";

type UniversityCardProps = {
  university: ListUniversity;
  showCapacity?: boolean;
  linkPrefix?: string;
};

const UniversityCard = ({ university, showCapacity = true, linkPrefix = "/university" }: UniversityCardProps) => {
  const convertedKoreanName = university.koreanName;
  const capacityLabel =
    university.studentCapacity === null || university.studentCapacity === undefined
      ? "모집 인원 미정"
      : `모집 ${university.studentCapacity}명`;

  const mappedHomeUniversitySlug = getHomeUniversitySlugByName(university.homeUniversityName);
  const hasExplicitPrefix = linkPrefix !== "/university";
  const universityDetailHref = mappedHomeUniversitySlug
    ? `/university/${mappedHomeUniversitySlug}/${university.id}`
    : hasExplicitPrefix
      ? `${linkPrefix}/${university.id}`
      : "/university";

  return (
    <Link className="block" href={universityDetailHref} aria-labelledby={`university-name-${university.id}`}>
      <div className="relative h-[91px] w-full overflow-hidden rounded-lg border border-solid border-k-100 transition-transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 md:h-[112px]">
        <div className="flex h-full items-center justify-between gap-4 px-5 py-3.5 md:px-6 md:py-5">
          <div className="flex min-w-0 gap-[23.5px] md:gap-5">
            <div className="flex flex-shrink-0 items-center">
              <Image
                className="h-14 w-14 rounded-full object-cover md:h-16 md:w-16"
                src={normalizeImageUrlToUploadCdn(university.logoImageUrl)}
                width={56}
                height={56}
                alt="대학 이미지"
                fallbackSrc="/svgs/placeholders/university-logo-placeholder.svg"
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <span
                id={`university-name-${university.id}`}
                className="truncate text-k-700 typo-bold-4 md:typo-bold-3"
                title={convertedKoreanName}
              >
                {convertedKoreanName}
              </span>
              <div className="flex items-center gap-2.5">
                <span className="truncate text-k-500 typo-medium-4 md:typo-medium-3">
                  {university.country} | {university.region}
                </span>
                {showCapacity && (
                  <span className="shrink-0 text-primary typo-sb-11 md:typo-sb-10">{capacityLabel}</span>
                )}
              </div>
              <div className="flex gap-4 md:mt-1">
                {university.languageRequirements.slice(0, 3).map((requirement, index) => {
                  const testName = shortenLanguageTestName(requirement.languageTestType);
                  return (
                    <span
                      key={`${requirement.languageTestType}-${requirement.minScore}-${index}`}
                      className="whitespace-nowrap text-primary typo-sb-11 md:typo-sb-10"
                    >
                      {testName ?? requirement.languageTestType} {requirement.minScore}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center">
            <CheveronRightFilled color="black" opacity="0.54" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard;
