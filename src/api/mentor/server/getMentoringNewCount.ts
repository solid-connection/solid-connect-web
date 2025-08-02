import serverFetch from "@/utils/serverFetchUtil";

import { MentoringNewCountResponse } from "../type/response";

const getMentoringNewCount = () => {
  return serverFetch<MentoringNewCountResponse>("/mentorings/check", {
    isAuth: true, // 로그인 필요
    next: { revalidate: 600 }, // ISR: 10분마다 백그라운드 갱신
  });
};

export default getMentoringNewCount;
