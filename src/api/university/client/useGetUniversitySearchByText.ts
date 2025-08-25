import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

// QueryKeys에 universitySearchText 추가 필요
import { ListUniversity } from "@/types/university";

// ListUniversity 타입 경로
import { useQuery } from "@tanstack/react-query";

// --- 타입 정의 ---
interface UniversitySearchTextResponse {
  univApplyInfoPreviews: ListUniversity[];
}

// --- API 호출 함수 ---
const getUniversitySearchByText = async (value: string): Promise<UniversitySearchTextResponse> => {
  const response: AxiosResponse<UniversitySearchTextResponse> = await axiosInstance.get(
    "/univ-apply-infos/search/text",
    {
      params: { value },
    },
  );
  return response.data;
};

// --- 커스텀 훅 ---
const useGetUniversitySearchByText = (searchValue: string) => {
  return useQuery<UniversitySearchTextResponse, Error, ListUniversity[]>({
    queryKey: [QueryKeys.universitySearchText, searchValue],
    queryFn: () => getUniversitySearchByText(searchValue),
    // 검색어가 있을 때만 쿼리를 실행합니다.
    enabled: !!searchValue && searchValue.trim().length > 0,
    // 실제 컴포넌트에는 univApplyInfoPreviews 배열만 전달합니다.
    select: (data) => data.univApplyInfoPreviews,
  });
};

export default useGetUniversitySearchByText;
