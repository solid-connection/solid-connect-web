import serverFetch from "@/utils/serverFetchUtil";

import { ListUniversity } from "@/types/university";

type GetRecommendedUniversityResponse = { recommendedUniversities: ListUniversity[] };

const getRecommendedUniversity = async () => {
  const endpoint = "/universities/recommend";

  const res = await serverFetch<GetRecommendedUniversityResponse>(endpoint);
  return res;
};

export default getRecommendedUniversity;
