import serverFetch from "@/utils/serverFetchUtil";

import { RecommendedCollegesResponse } from "../type/response";

const getRecommendedColleges = () =>
  serverFetch<RecommendedCollegesResponse>("/mentorings/check", {
    isAuth: false, // 로그인 불필요
  });

export default getRecommendedColleges;
