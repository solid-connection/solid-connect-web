import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type KakaoInfoResponse, kakaoApiApi } from "./api";

const useGetKakaoInfo = (params?: Record<string, unknown>) => {
  return useQuery<KakaoInfoResponse, AxiosError>({
    queryKey: [QueryKeys["kakao-api"].kakaoInfo, params],
    queryFn: () => kakaoApiApi.getKakaoInfo(params ? { params } : {}),
  });
};

export default useGetKakaoInfo;
