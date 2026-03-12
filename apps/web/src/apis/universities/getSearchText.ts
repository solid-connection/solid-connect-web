import { useQuery } from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { useMemo } from "react";
import { isMatchedHomeUniversityName } from "@/constants/university";
import type { HomeUniversityName, ListUniversity } from "@/types/university";
import { QueryKeys } from "../queryKeys";
import { type SearchTextResponse, universitiesApi } from "./api";

// API 응답에 homeUniversityName이 포함된 타입
interface ListUniversityWithHome extends ListUniversity {
  homeUniversityName?: HomeUniversityName;
}

/**
 * @description 대학 검색을 위한 useQuery 커스텀 훅
 * 모든 대학 데이터를 한 번만 가져와 캐싱하고, 검색어에 따라 클라이언트에서 필터링합니다.
 * @param searchValue - 검색어
 * @param homeUniversityName - 홈 대학교 이름 (선택적 필터)
 */
const useUniversitySearch = (searchValue: string, homeUniversityName?: HomeUniversityName) => {
  // 1. 모든 대학 데이터를 한 번만 가져와 'Infinity' 캐시로 저장합니다.
  const {
    data: allUniversities,
    isLoading,
    isError,
    error,
  } = useQuery<SearchTextResponse, AxiosError, ListUniversityWithHome[]>({
    queryKey: [QueryKeys.universities.searchText],
    queryFn: () => universitiesApi.getSearchText({ value: "" }),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (data) => data.univApplyInfoPreviews as unknown as ListUniversityWithHome[],
  });

  // 2. 검색어와 homeUniversityName에 따라 필터링합니다.
  const filteredUniversities = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!allUniversities) {
      return [];
    }

    let filtered = allUniversities;

    // homeUniversityName 필터링
    if (homeUniversityName) {
      filtered = filtered.filter((university) =>
        isMatchedHomeUniversityName(university.homeUniversityName, homeUniversityName),
      );
    }

    // 검색어 필터링
    if (normalizedSearchValue) {
      filtered = filtered.filter((university) => university.koreanName.toLowerCase().includes(normalizedSearchValue));
    }

    return filtered;
  }, [allUniversities, searchValue, homeUniversityName]);

  return {
    data: filteredUniversities,
    isLoading,
    isError,
    error,
    totalCount: allUniversities?.length || 0,
  };
};

export default useUniversitySearch;
