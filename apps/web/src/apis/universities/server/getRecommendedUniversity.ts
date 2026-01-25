import type { ListUniversity } from "@/types/university";
import serverFetch from "@/utils/serverFetchUtil";

type GetRecommendedUniversityResponse = { recommendedUniversities: ListUniversity[] };

const getRecommendedUniversity = async () => {
  const endpoint = "/univ-apply-infos/recommend";

  const res = await serverFetch<GetRecommendedUniversityResponse>(endpoint);
  return res;
};

export default getRecommendedUniversity;
