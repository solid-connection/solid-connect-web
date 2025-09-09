import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { ListUniversity } from "@/types/university";

import { getAccessTokenWithReissue } from "@/lib/zustand/useAuthStore";
import { useQuery } from "@tanstack/react-query";

type UseGetRecommendedUniversityResponse = { recommendedUniversities: ListUniversity[] };
type UseGetRecommendedUniversityRequest = {
  isLogin: boolean;
};

const getRecommendedUniversity = async (isLogin: boolean): Promise<UseGetRecommendedUniversityResponse> => {
  const endpoint = "/univ-apply-infos/recommend";

  let instance = publicAxiosInstance;
  if (isLogin) {
    const isLoginState = await getAccessTokenWithReissue();
    instance = isLoginState ? axiosInstance : publicAxiosInstance;
  }
  const res = await instance.get<UseGetRecommendedUniversityResponse>(endpoint);
  return res.data;
};

const useGetRecommendedUniversity = ({ isLogin }: UseGetRecommendedUniversityRequest) =>
  useQuery({
    queryKey: [QueryKeys.recommendedUniversity, isLogin],
    queryFn: () => getRecommendedUniversity(isLogin),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.recommendedUniversities, // 필요한 데이터만 반환
  });

export default useGetRecommendedUniversity;
