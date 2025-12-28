import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { KakaoInfoResponse, kakaoApiApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetKakaoInfo = (params?: Record<string, any>) => {
  return useQuery<KakaoInfoResponse, AxiosError>({
    queryKey: [QueryKeys["kakao-api"].kakaoInfo, params],
    queryFn: () => kakaoApiApi.getKakaoInfo(params ? { params } : {}),
  });
};

export default useGetKakaoInfo;
