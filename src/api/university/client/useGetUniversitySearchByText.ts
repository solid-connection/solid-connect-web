import { useMemo } from "react";

import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { ListUniversity } from "@/types/university";

import { useQuery } from "@tanstack/react-query";

// --- 타입 정의 ---
interface UniversitySearchTextResponse {
  univApplyInfoPreviews: ListUniversity[];
}

// --- API 호출 함수 ---
const getAllUniversitiesApi = async (): Promise<UniversitySearchTextResponse> => {
  const response: AxiosResponse<UniversitySearchTextResponse> = await publicAxiosInstance.get(
    "/univ-apply-infos/search/text",
    {
      params: { value: "" }, // 항상 빈 값으로 호출
    },
  );
  return response.data;
};

const useUniversitySearch = (searchValue: string) => {
  // 1. 모든 대학 데이터를 한 번만 가져와 'Infinity' 캐시로 저장합니다.
  const {
    data: allUniversities, // 모든 대학 목록
    isLoading,
    isError,
    error,
  } = useQuery<UniversitySearchTextResponse, Error, ListUniversity[]>({
    queryKey: [QueryKeys.universitySearchText], // "모든 대학"을 위한 고유 키
    queryFn: getAllUniversitiesApi,
    staleTime: Infinity, // 한번 가져오면 절대 다시 요청하지 않음
    gcTime: Infinity, // 캐시가 절대 삭제되지 않음 (선택 사항)
    select: (data) => data.univApplyInfoPreviews,
  });

  // 2. 검색어가 변경될 때만 캐시된 데이터를 필터링합니다.
  const filteredUniversities = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return allUniversities; // 검색어가 없으면 전체 목록 반환
    }

    // allUniversities가 아직 로드되지 않았으면 빈 배열 반환
    if (!allUniversities) {
      return [];
    }

    // 대학 이름(koreanName)에 검색어가 포함되어 있는지 확인하여 필터링
    return allUniversities.filter((university) => university.koreanName.toLowerCase().includes(normalizedSearchValue));
  }, [allUniversities, searchValue]); // allUniversities나 searchValue가 바뀔 때만 재계산

  return {
    data: filteredUniversities, // 필터링된 결과
    isLoading, // 초기 데이터 로딩 상태
    isError,
    error,
    totalCount: allUniversities?.length || 0, // 전체 대학 수 (필요시 사용)
  };
};
export default useUniversitySearch;
