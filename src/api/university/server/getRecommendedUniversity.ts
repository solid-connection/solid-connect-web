import serverFetch from "@/utils/serverFetchUtil";

import { RecommendedUniversityResponse } from "../type/response";

const getRecommendedUniversity = async () => {
  const res = await serverFetch<RecommendedUniversityResponse>("/univ-apply-infos/recommend", {
    isAuth: false, // 인증이 필요 없는 API로 설정
  });
  return res;
};

export default getRecommendedUniversity;
