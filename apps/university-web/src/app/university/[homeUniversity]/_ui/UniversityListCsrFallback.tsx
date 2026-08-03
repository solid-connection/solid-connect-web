"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/apis/queryKeys";
import { type SearchTextResponse, universitiesApi } from "@/apis/universities/api";
import type { HomeUniversitySlug, ListUniversity } from "@/types/university";

import UniversityListContent from "./UniversityListContent";

interface UniversityListCsrFallbackProps {
  homeUniversityId: number;
  homeUniversitySlug: HomeUniversitySlug;
}

/**
 * SSG(빌드 시점) 또는 서버 렌더 단계에서 파견학교 목록을 가져오지 못했을 때 사용하는 클라이언트 폴백.
 * 빈 목록을 정적으로 굳혀버리지 않고, 브라우저에서 같은 API를 다시 조회한다.
 */
const UniversityListCsrFallback = ({ homeUniversityId, homeUniversitySlug }: UniversityListCsrFallbackProps) => {
  const {
    data: universities,
    isPending,
    isError,
  } = useQuery<SearchTextResponse, Error, ListUniversity[]>({
    queryKey: [QueryKeys.universities.searchText, { homeUniversityId }],
    queryFn: () => universitiesApi.getSearchText({ value: "", homeUniversityId }),
    select: (data) => data.univApplyInfoPreviews,
  });

  if (isPending) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center px-5 text-center text-k-400 typo-regular-3"
        role="status"
        aria-live="polite"
      >
        파견학교 목록을 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !universities) {
    return (
      <div
        className="flex min-h-[50vh] flex-col items-center justify-center px-5 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-k-700 typo-sb-9">목록을 불러오지 못했습니다.</p>
        <p className="mt-1 text-k-400 typo-regular-3">잠시 후 다시 확인해주세요.</p>
      </div>
    );
  }

  return <UniversityListContent universities={universities} homeUniversitySlug={homeUniversitySlug} />;
};

export default UniversityListCsrFallback;
