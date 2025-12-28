import { useMemo } from "react";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, SearchTextResponse } from "./api";
import { QueryKeys } from "../queryKeys";
import { ListUniversity } from "@/types/university";

/**
 * @description 대학 검색을 위한 useQuery 커스텀 훅
 * 모든 대학 데이터를 한 번만 가져와 캐싱하고, 검색어에 따라 클라이언트에서 필터링합니다.
 * @param searchValue - 검색어
 */
const useUniversitySearch = (searchValue: string) => {
  // 1. 모든 대학 데이터를 한 번만 가져와 'Infinity' 캐시로 저장합니다.
  const {
    data: allUniversities,
    isLoading,
    isError,
    error,
  } = useQuery<SearchTextResponse, AxiosError, ListUniversity[]>({
    queryKey: [QueryKeys.universities.searchText],
    queryFn: () => universitiesApi.getSearchText({ value: "" }),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (data) => data.univApplyInfoPreviews as unknown as ListUniversity[],
  });

  // 2. 검색어가 변경될 때만 캐시된 데이터를 필터링합니다.
  const filteredUniversities = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return allUniversities;
    }

    if (!allUniversities) {
      return [];
    }

    return allUniversities.filter((university) =>
      university.koreanName.toLowerCase().includes(normalizedSearchValue)
    );
  }, [allUniversities, searchValue]);

  return {
    data: filteredUniversities,
    isLoading,
    isError,
    error,
    totalCount: allUniversities?.length || 0,
  };
};

export default useUniversitySearch;