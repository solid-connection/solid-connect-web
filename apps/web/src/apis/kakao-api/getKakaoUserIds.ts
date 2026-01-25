import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { kakaoApiApi, KakaoUserIdsResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetKakaoUserIds = (params?: Record<string, any>) => {
  return useQuery<KakaoUserIdsResponse, AxiosError>({
    queryKey: [QueryKeys['kakao-api'].kakaoUserIds, params],
    queryFn: () => kakaoApiApi.getKakaoUserIds(params ? { params } : {}),
  });
};

export default useGetKakaoUserIds;