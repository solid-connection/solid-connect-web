import serverFetch from "@/utils/serverFetchUtil";

import { ListUniversity } from "@/types/university";

interface UniversitySearchResponse {
  univApplyInfoPreviews: ListUniversity[];
}

export const getSearchUniversitiesByText = async (value: string): Promise<ListUniversity[]> => {
  // 검색어가 없으면 빈 배열을 반환하여 불필요한 요청을 막습니다.
  if (!value || value.trim() === "") {
    return [];
  }

  const endpoint = `/univ-apply-infos/search/text?value=${encodeURIComponent(value)}`;
  const response = await serverFetch<UniversitySearchResponse>(endpoint);

  return response.ok ? response.data.univApplyInfoPreviews : [];
};
