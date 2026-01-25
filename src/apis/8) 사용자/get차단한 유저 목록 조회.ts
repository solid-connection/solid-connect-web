import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 8) 사용자Api, 차단한 유저 목록 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet차단한 유저 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<차단한 유저 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys.8) 사용자.차단한 유저 목록 조회, params],
    queryFn: () => 8) 사용자Api.get차단한 유저 목록 조회(params ? { params } : {}),
  });
};

export default useGet차단한 유저 목록 조회;