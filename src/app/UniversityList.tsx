"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getUniversityListPublicApi } from "@/services/university";
import { shortenLanguageTestName } from "@/utils/universityUtils";

import ButtonTab from "@/components/ui/ButtonTab";
import CheveronRightFilled from "@/components/ui/icon/ChevronRightFilled";

import { languageTestShortMapping } from "@/types/score";
import { ListUniversity, regionMapping } from "@/types/university";

const UniversityList = () => {
  const [region, setRegion] = useState<"전체" | "영미권" | "유럽권" | "아시아권">("전체");
  const [universities, setUniversities] = useState<ListUniversity[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await getUniversityListPublicApi(regionMapping[region]);
        setUniversities(response.data.slice(0, 3));
      } catch {
        setUniversities([]);
      }
    };

    fetchUniversities();
  }, [region]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-lg font-semibold leading-snug text-[#44413D]">전체 학교 리스트</span>
        <Link href="/university">
          <span className="text-[13px] font-semibold leading-snug text-[#76797D] underline decoration-solid decoration-auto underline-offset-auto">
            더보기
          </span>
        </Link>
      </div>
      <div className="">
        <ButtonTab // TODO: 디자인 변경
          choices={["전체", "영미권", "유럽권", "아시아권", "중국권"]}
          choice={region}
          setChoice={setRegion}
          color={{
            activeBtn: "bg-primary-100",
            deactiveBtn: "bg-k-50",
            activeBtnFont: "text-primary",
            deactiveBtnFont: "text-k-300",
            background: "white",
          }}
        />
      </div>
      <UniversityCards colleges={universities} />
    </div>
  );
};

export default UniversityList;

type UniversityCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
};

const UniversityCards = ({ colleges, style }: UniversityCardsProps) => (
  <div className="flex flex-col gap-2" style={style}>
    {colleges.map((university) => (
      <UniversityCard key={university.id} university={university} />
    ))}
  </div>
);

type UniversityCardProps = {
  university: ListUniversity;
};

const UniversityCard = ({ university }: UniversityCardProps) => {
  const convertedKoreanName =
    university.term !== process.env.NEXT_PUBLIC_CURRENT_TERM
      ? `${university.koreanName}(${university.term})`
      : university.koreanName;
  return (
    <Link
      className="relative flex h-[91px] gap-5 overflow-hidden rounded-lg bg-k-50 p-5 no-underline"
      href={`/university/${university.id}`}
    >
      <div className="flex items-center">
        <Image
          className="h-[55px] w-[55px] rounded-full object-cover"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${university.logoImageUrl}`}
          width={55}
          height={55}
          alt={convertedKoreanName || "대학 이미지"}
        />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex justify-between">
          <span className="truncate font-serif text-base font-semibold leading-normal text-black">
            {convertedKoreanName}
          </span>
          <div className="flex shrink-0 gap-2.5">
            <span className="text-sm font-semibold leading-normal text-primary">
              {university.country} | {university.region}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
              <path
                d="M9.51953 14L13.5195 10L9.51953 6"
                stroke="#5F6268"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex gap-2.5">
          {university.languageRequirements.slice(0, 3).map((requirement) => (
            <span
              key={requirement.languageTestType}
              className="whitespace-nowrap text-sm font-medium leading-normal text-[#919397]"
            >
              {languageTestShortMapping[requirement.languageTestType] || ""} {requirement.minScore || ""}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute right-[9.77px] top-[38px] h-6 w-6"></div>
    </Link>
  );
};
