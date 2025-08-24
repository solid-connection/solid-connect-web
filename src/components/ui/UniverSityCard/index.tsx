import Image from "next/image";
import Link from "next/link";

import { convertImageUrl } from "@/utils/fileUtils";
import { shortenLanguageTestName } from "@/utils/universityUtils";

import CheveronRightFilled from "@/components/ui/icon/ChevronRightFilled";

import { ListUniversity } from "@/types/university";

type UniversityCardProps = {
  university: ListUniversity;
  showCapacity?: boolean;
};

const UniversityCard = ({ university, showCapacity = true }: UniversityCardProps) => {
  const convertedKoreanName =
    university.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${university.koreanName}(${university.term})`
      : university.koreanName;

  return (
    <Link
      className="relative h-[91px] overflow-hidden rounded-lg border border-solid border-k-100 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
      href={`/university/${university.id}`}
      aria-labelledby={`university-name-${university.id}`}
    >
      <div className="flex justify-between px-5 py-3.5">
        <div className="flex gap-[23.5px]">
          <div className="flex flex-shrink-0 items-center">
            <Image
              className="h-14 w-14 rounded-full object-cover"
              src={convertImageUrl(university.logoImageUrl)}
              width={62}
              height={62}
              alt="대학 이미지"
            />
          </div>

          <div className="flex flex-col">
            <span
              id={`university-name-${university.id}`}
              className="truncate text-base font-bold leading-normal text-k-700"
              aria-label={convertedKoreanName}
            >
              {convertedKoreanName}
            </span>
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
            <div className="flex gap-4">
              {university.languageRequirements.slice(0, 3).map((requirement) => (
                <span
                  key={requirement.languageTestType}
                  className="whitespace-nowrap text-xs font-medium leading-normal text-k-500"
                >
                  {shortenLanguageTestName(requirement.languageTestType)} {requirement.minScore}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <CheveronRightFilled color="black" opacity="0.54" />
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard;
