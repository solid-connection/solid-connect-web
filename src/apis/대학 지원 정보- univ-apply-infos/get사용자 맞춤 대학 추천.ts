import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 대학 지원 정보 univApplyInfosApi, 사용자 맞춤 대학 추천Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet사용자 맞춤 대학 추천 = (params?: Record<string, any>) => {
  return useQuery<사용자 맞춤 대학 추천Response, AxiosError>({
    queryKey: [QueryKeys['대학 지원 정보- univ-apply-infos'].사용자 맞춤 대학 추천, params],
    queryFn: () => 대학 지원 정보 univApplyInfosApi.get사용자 맞춤 대학 추천(params ? { params } : {}),
  });
};

export default useGet사용자 맞춤 대학 추천;