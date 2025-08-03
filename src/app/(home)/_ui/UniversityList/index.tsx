"use client";

import Link from "next/link";
import { useMemo } from "react";

import { isAuthenticated } from "@/utils/authUtils";

import ButtonTab from "@/components/ui/ButtonTab";
import UniversityCards from "@/components/university/UniversityCards";

import useRegionHandler from "./_hooks/useRegionHandler";

import { AllRegionsUniversityList, ListUniversity, RegionEnumExtend } from "@/types/university";

import useGetRecommendedUniversity from "@/api/university/client/useGetRecommendedUniversity";

interface UniversityListProps {
  allRegionsUniversityList: AllRegionsUniversityList;
}

const UniversityList = ({ allRegionsUniversityList }: UniversityListProps) => {
  // 로그인 시에는 추천 대학 정보를 가져오고, 비로그인 시에는 isr로 가져온 데이터를 사용합니다
  const isLogin = isAuthenticated();
  const { data, error } = useGetRecommendedUniversity(isLogin);
  const clientFetchedRecommendedUniversities = data?.recommendedUniversities || [];

  const { region, handleRegionChange } = useRegionHandler();
  const choices = Object.values(RegionEnumExtend);
  // 권역별 전체 리스트
  // 로그인 상태에 따라 추천 대학 리스트를 가져오거나, 권역별 리스트를 사용합니다
  const universities: ListUniversity[] =
    isLogin && !error ? clientFetchedRecommendedUniversities : region ? (allRegionsUniversityList[region] ?? []) : [];
  // 홈 카드 영역에는 최대 3개만 노출
  const previewUniversities: ListUniversity[] = useMemo(() => universities.slice(0, 3), [universities]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-lg font-semibold leading-snug text-k-700">전체 학교 리스트</span>
        <Link href="/university">
          <span className="text-xs font-semibold leading-snug text-k-500 underline decoration-solid decoration-auto underline-offset-auto">
            더보기
          </span>
        </Link>
      </div>
      <ButtonTab
        choices={choices}
        choice={region}
        setChoice={handleRegionChange}
        color={{
          activeBtn: "bg-secondary-100",
          deactiveBtn: "bg-k-50",
          activeBtnFont: "text-secondary",
          deactiveBtnFont: "text-k-300",
          background: "white",
        }}
      />
      <UniversityCards colleges={previewUniversities} showCapacity={false} />
    </div>
  );
};

export default UniversityList;
