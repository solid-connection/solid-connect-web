import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

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
  const response: AxiosResponse<UniversitySearchTextResponse> = await publicAxiosInstance.get(
    "/univ-apply-infos/search/text",
    {
      params: { value },
    },
  );
  return response.data;
};

// --- 커스텀 훅 ---
const useGetUniversitySearchByText = (searchValue: string) => {
  const staleTime = searchValue === "" ? Infinity : 1000 * 60 * 5;

  return useQuery<UniversitySearchTextResponse, Error, ListUniversity[]>({
    queryKey: [QueryKeys.universitySearchText, searchValue],
    queryFn: () => getUniversitySearchByText(searchValue),
    staleTime,
    select: (data) => data.univApplyInfoPreviews,
  });
};

export default useGetUniversitySearchByText;
