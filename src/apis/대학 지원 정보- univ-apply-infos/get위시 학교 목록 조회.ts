import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 대학 지원 정보 univApplyInfosApi, 위시 학교 목록 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet위시 학교 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<위시 학교 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys['대학 지원 정보- univ-apply-infos'].위시 학교 목록 조회, params],
    queryFn: () => 대학 지원 정보 univApplyInfosApi.get위시 학교 목록 조회(params ? { params } : {}),
  });
};

export default useGet위시 학교 목록 조회;