import Image from "next/image";
import Link from "next/link";

import { shortenLanguageTestName } from "@/utils/universityUtils";

import CheveronRightFilled from "@/components/ui/icon/ChevronRightFilled";

import { ListUniversity } from "@/types/university";

type UniversityCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
};

const UniversityCards = ({ colleges, style }: UniversityCardsProps) => (
  <div className="flex flex-col gap-2.5" style={style}>
    {colleges.map((university) => (
      <UniversityCard key={university.id} university={university} />
    ))}
  </div>
);
export default UniversityCards;

type UniversityCardProps = {
  university: ListUniversity;
};

export const UniversityCard = ({ university }: UniversityCardProps) => {
  const convertedKoreanName =
    university.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${university.koreanName}(${university.term})`
      : university.koreanName;

  return (
    <Link
      className="relative mx-5 flex h-[91px] overflow-hidden rounded-lg border border-solid border-k-100 px-5 py-3 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
      href={`/university/${university.id}`}
    >
      <div className="flex flex-shrink-0 items-center">
        <Image
          className="h-14 w-14 rounded-full object-cover"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${university.logoImageUrl}`}
          width={100}
          height={100}
          alt={convertedKoreanName || "대학 이미지"}
        />
      </div>

      <div className="ml-[22px] flex flex-grow flex-col">
        <span className="truncate text-base font-bold leading-normal text-k-700">{convertedKoreanName}</span>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium leading-normal text-k-500">
            {university.country} | {university.region}
          </span>
          <div className="flex items-center">
            <span className="text-xs font-semibold leading-normal text-primary">
              모집 {university.studentCapacity}명
            </span>
            <CheveronRightFilled color="black" opacity="0.54" />
          </div>
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

      <div className="absolute right-[9.77px] top-[38px] h-6 w-6"></div>
    </Link>
  );
};
