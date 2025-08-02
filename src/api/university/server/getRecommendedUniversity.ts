import serverFetch from "@/utils/serverFetchUtil";

import { RecommendedUniversityResponse } from "../type/response";

const getRecommendedUniversity = async () => {

  const endpoint = process.env.NODE_ENV !== "development" ? "/univ-apply-infos/recommend" : "/universities/recommend";


  const res = await serverFetch<RecommendedUniversityResponse>(endpoint, {
    isAuth: false, // 인증이 필요 없는 API로 설정
  });
  return res;
};

export default getRecommendedUniversity;
