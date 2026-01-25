import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 대학 지원 정보 univApplyInfosApi, 학교 텍스트 검색Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet학교 텍스트 검색 = (params?: Record<string, any>) => {
  return useQuery<학교 텍스트 검색Response, AxiosError>({
    queryKey: [QueryKeys['대학 지원 정보- univ-apply-infos'].학교 텍스트 검색, params],
    queryFn: () => 대학 지원 정보 univApplyInfosApi.get학교 텍스트 검색(params ? { params } : {}),
  });
};

export default useGet학교 텍스트 검색;