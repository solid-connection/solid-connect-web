import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { KakaoUserIdsResponse, kakaoApiApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetKakaoUserIds = (params?: Record<string, any>) => {
  return useQuery<KakaoUserIdsResponse, AxiosError>({
    queryKey: [QueryKeys["kakao-api"].kakaoUserIds, params],
    queryFn: () => kakaoApiApi.getKakaoUserIds(params ? { params } : {}),
  });
};

export default useGetKakaoUserIds;
