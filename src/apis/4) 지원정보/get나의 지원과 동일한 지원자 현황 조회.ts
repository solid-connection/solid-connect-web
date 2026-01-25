import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 4) 지원정보Api, 나의 지원과 동일한 지원자 현황 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet나의 지원과 동일한 지원자 현황 조회 = (params?: Record<string, any>) => {
  return useQuery<나의 지원과 동일한 지원자 현황 조회Response, AxiosError>({
    queryKey: [QueryKeys.4) 지원정보.나의 지원과 동일한 지원자 현황 조회, params],
    queryFn: () => 4) 지원정보Api.get나의 지원과 동일한 지원자 현황 조회(params ? { params } : {}),
  });
};

export default useGet나의 지원과 동일한 지원자 현황 조회;