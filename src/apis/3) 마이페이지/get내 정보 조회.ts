import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 3) 마이페이지Api, 내 정보 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet내 정보 조회 = (params?: Record<string, any>) => {
  return useQuery<내 정보 조회Response, AxiosError>({
    queryKey: [QueryKeys.3) 마이페이지.내 정보 조회, params],
    queryFn: () => 3) 마이페이지Api.get내 정보 조회(params ? { params } : {}),
  });
};

export default useGet내 정보 조회;