import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";

import { shortenLanguageTestName } from "@/utils/universityUtils";

import CheveronRightFilled from "@/components/ui/icon/ChevronRightFilled";

import { ListUniversity } from "@/types/university";

type UniversityCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
  className?: string;
  showCapacity?: boolean;
};

const UniversityCards = ({ colleges, style, className, showCapacity = true }: UniversityCardsProps) => (
  <div className={clsx("flex flex-col gap-2.5", className)} style={style}>
    {colleges.map((university) => (
      <UniversityCard key={university.id} university={university} showCapacity={showCapacity} />
    ))}
  </div>
);
export default UniversityCards;

type UniversityCardProps = {
  university: ListUniversity;
  showCapacity?: boolean;
};

export const UniversityCard = ({ university, showCapacity = true }: UniversityCardProps) => {
  const convertedKoreanName =
    university.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${university.koreanName}(${university.term})`
      : university.koreanName;

  return (
    <Link
      className="relative h-[91px] overflow-hidden rounded-lg border border-solid border-k-100 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
      href={`/university/${university.id}`}
    >
      <div className="flex justify-between px-5 py-3.5">
        <div className="flex gap-[23.5px]">
          <UniversityLogo logoImageUrl={university.logoImageUrl} />

          <div className="flex flex-col">
            <span className="truncate text-base font-bold leading-normal text-k-700">{convertedKoreanName}</span>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium leading-normal text-k-500">
                {university.country} | {university.region}
              </span>
              {showCapacity && (
                <span className="text-xs font-semibold leading-normal text-primary">
                  모집 {university.studentCapacity}명
                </span>
              )}
            </div>
            <LanguageRequirements languageRequirements={university.languageRequirements} />
          </div>
        </div>
        <div className="flex items-center">
          <CheveronRightFilled color="black" opacity="0.54" />
        </div>
      </div>
    </Link>
  );
};

const UniversityLogo = ({ logoImageUrl }: { logoImageUrl: string }) => (
  <div className="flex flex-shrink-0 items-center">
    <Image
      className="h-14 w-14 rounded-full object-cover"
      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${logoImageUrl}`}
      width={62}
      height={62}
      alt="대학 이미지"
    />
  </div>
);

const LanguageRequirements = ({
  languageRequirements,
}: {
  languageRequirements: ListUniversity["languageRequirements"];
}) => (
  <div className="flex gap-4">
    {languageRequirements.slice(0, 3).map((requirement) => (
      <span
        key={requirement.languageTestType}
        className="whitespace-nowrap text-xs font-medium leading-normal text-k-500"
      >
        {shortenLanguageTestName(requirement.languageTestType)} {requirement.minScore}
      </span>
    ))}
  </div>
);
