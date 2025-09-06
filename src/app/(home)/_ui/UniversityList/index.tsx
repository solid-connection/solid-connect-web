"use client";

import Link from "next/link";
import { useMemo } from "react";

import ButtonTab from "@/components/ui/ButtonTab";
import UniversityCards from "@/components/university/UniversityCards";

import useRegionHandler from "./_hooks/useRegionHandler";

import { AllRegionsUniversityList, ListUniversity, RegionEnumExtend } from "@/types/university";

import { IconDirectionRight } from "@/public/svgs/mentor";

interface UniversityListProps {
  allRegionsUniversityList: AllRegionsUniversityList;
}

const UniversityList = ({ allRegionsUniversityList }: UniversityListProps) => {
  const { region, handleRegionChange } = useRegionHandler();
  const choices = Object.values(RegionEnumExtend);

  const universities: ListUniversity[] = useMemo(
    () => allRegionsUniversityList[region || RegionEnumExtend.ALL] ?? [],
    [allRegionsUniversityList, region],
  );
  // 홈 카드 영역에는 최대 3개만 노출
  const previewUniversities: ListUniversity[] = useMemo(() => universities.slice(0, 3), [universities]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-lg font-semibold leading-snug text-k-700">전체 학교 리스트</span>
        <Link href="/university">
          <span className="flex items-center gap-1 text-sm font-semibold text-k-500">
            더보기
            <IconDirectionRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
      <ButtonTab
        choices={choices}
        choice={region}
        setChoice={handleRegionChange}
        color={{
          activeBtn: "bg-primary-100",
          deactiveBtn: "bg-k-50",
          activeBtnFont: "text-primary",
          deactiveBtnFont: "text-k-300",
          background: "white",
        }}
      />
      <UniversityCards colleges={previewUniversities} showCapacity={false} />
    </div>
  );
};

export default UniversityList;
