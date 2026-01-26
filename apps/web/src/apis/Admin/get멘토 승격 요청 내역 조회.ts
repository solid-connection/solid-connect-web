import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { adminApi, 멘토 승격 요청 내역 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet멘토 승격 요청 내역 조회 = (params?: Record<string, any>) => {
  return useQuery<멘토 승격 요청 내역 조회Response, AxiosError>({
    queryKey: [QueryKeys.Admin.멘토 승격 요청 내역 조회, params],
    queryFn: () => adminApi.get멘토 승격 요청 내역 조회(params ? { params } : {}),
  });
};

export default useGet멘토 승격 요청 내역 조회;