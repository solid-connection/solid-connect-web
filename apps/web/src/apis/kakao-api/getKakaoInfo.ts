import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { kakaoApiApi, KakaoInfoResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetKakaoInfo = (params?: Record<string, any>) => {
  return useQuery<KakaoInfoResponse, AxiosError>({
    queryKey: [QueryKeys['kakao-api'].kakaoInfo, params],
    queryFn: () => kakaoApiApi.getKakaoInfo(params ? { params } : {}),
  });
};

export default useGetKakaoInfo;