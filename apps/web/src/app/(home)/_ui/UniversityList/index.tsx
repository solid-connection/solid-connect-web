"use client";

import Link from "next/link";

import ButtonTab from "@/components/ui/ButtonTab";
import UniversityCards from "@/components/university/UniversityCards";
import { IconDirectionRight } from "@/public/svgs/mentor";

import type { AllRegionsUniversityList } from "@/types/university";
import useHomeUniversityList from "./_hooks/useHomeUniversityList";

interface UniversityListProps {
  allRegionsUniversityList: AllRegionsUniversityList;
}

const UniversityList = ({ allRegionsUniversityList }: UniversityListProps) => {
  const { selectedHomeUniversity, setSelectedHomeUniversity, homeUniversityChoices, previewUniversities, moreHref } =
    useHomeUniversityList(allRegionsUniversityList);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-k-700 typo-sb-5">전체 학교 리스트</span>
        <Link href={moreHref}>
          <span className="flex items-center gap-1 text-k-500 typo-sb-9">
            더보기
            <IconDirectionRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
      <ButtonTab
        choices={homeUniversityChoices}
        choice={selectedHomeUniversity}
        setChoice={setSelectedHomeUniversity}
        color={{
          activeBtn: "bg-primary-100",
          deactiveBtn: "bg-k-50",
          activeBtnFont: "text-primary",
          deactiveBtnFont: "text-k-300",
          background: "bg-white",
        }}
      />
      <UniversityCards colleges={previewUniversities} showCapacity={false} />
    </div>
  );
};

export default UniversityList;
