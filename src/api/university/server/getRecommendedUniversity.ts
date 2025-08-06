import serverFetch from "@/utils/serverFetchUtil";

import { RecommendedUniversityResponse } from "../type/response";

const getRecommendedUniversity = async () => {
  const endpoint = "/univ-apply-infos/recommend";

  const res = await serverFetch<RecommendedUniversityResponse>(endpoint);
  return res;
};

export default getRecommendedUniversity;
