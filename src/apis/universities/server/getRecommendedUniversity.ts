import type { ListUniversity } from "@/types/university";
import serverFetch from "@/utils/serverFetchUtil";

type GetRecommendedUniversityResponse = { recommendedUniversities: ListUniversity[] };

/**
 * 추천 대학 목록을 가져옵니다.
 * @returns ServerFetchResult - 호출 측에서 result.ok 체크 필요
 */
const getRecommendedUniversity = async () => {
  const endpoint = "/univ-apply-infos/recommend";

  const res = await serverFetch<GetRecommendedUniversityResponse>(endpoint);
  return res;
};

export default getRecommendedUniversity;
