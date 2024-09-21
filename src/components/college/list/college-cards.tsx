import Image from "next/image";
import Link from "next/link";

import { shortenLanguageTestName } from "@/utils/universityUtils";

import CheveronRightFilled from "../../ui/icon/ChevronRightFilled";
import styles from "./college-cards.module.css";

import { ListUniversity } from "@/types/university";

type CollegeCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
};

export default function CollegeCards({ colleges, style }: CollegeCardsProps) {
  return (
    <div className="flex flex-col gap-2" style={style}>
      {colleges.map((college) => (
        <CollegeCard key={college.id} {...college} />
      ))}
    </div>
  );
}

export function CollegeCard({
  id,
  term,
  koreanName,
  region,
  country,
  logoImageUrl,
  studentCapacity,
  languageRequirements,
}: ListUniversity) {
  const convertedKoreanName = term !== process.env.NEXT_PUBLIC_CURRENT_TERM ? `${koreanName}(${term})` : koreanName;
  return (
    <Link
      className={
        "relative mx-5 flex h-[99px] overflow-hidden rounded-md border border-solid border-[#eaeaea] no-underline hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
      }
      href={`/college/${id}`}
    >
      <div className="flex items-center">
        <Image
          className="ml-3 h-[60px] w-[60px] rounded-[60px] object-cover"
          src={logoImageUrl}
          width={100}
          height={100}
          alt={convertedKoreanName || "대학 이미지"}
        />
      </div>

      <div className="ml-4 flex flex-col no-underline">
        <span className="mt-[18px] font-serif text-base font-semibold leading-normal text-black">
          {convertedKoreanName}
        </span>
        <div className="flex gap-[3px]">
          <span className="mt-1.5 font-serif text-sm font-semibold leading-[150%] text-[#7c7c7c]">
            {country} | {region}
          </span>
          <span className="ml-2.5 mt-1.5 font-serif text-xs font-semibold leading-[150%] text-[#7c7c7c]">
            모집 {studentCapacity}명
          </span>
        </div>
        <div className="flex gap-4">
          {languageRequirements.slice(0, 3).map((requirement, index) => {
            return (
              <span
                key={index}
                className="whitespace-nowrap font-serif text-xs font-semibold leading-[150%] tracking-[0.15px] text-[#7c7c7c]"
              >
                {shortenLanguageTestName(requirement.languageTestType)}: {requirement.minScore}
              </span>
            );
          })}
        </div>
      </div>

      <div className="absolute right-[9.77px] top-[38px] h-6 w-6">
        <CheveronRightFilled color="black" opacity="0.54" />
      </div>
    </Link>
  );
}
