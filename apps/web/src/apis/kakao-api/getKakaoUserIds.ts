import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type KakaoUserIdsResponse, kakaoApiApi } from "./api";

const useGetKakaoUserIds = (params?: Record<string, any>) => {
  return useQuery<KakaoUserIdsResponse, AxiosError>({
    queryKey: [QueryKeys["kakao-api"].kakaoUserIds, params],
    queryFn: () => kakaoApiApi.getKakaoUserIds(params ? { params } : {}),
  });
};

export default useGetKakaoUserIds;
