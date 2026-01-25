import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 10) 소식지Api, 소식지 목록 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet소식지 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<소식지 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys.10) 소식지.소식지 목록 조회, params],
    queryFn: () => 10) 소식지Api.get소식지 목록 조회(params ? { params } : {}),
  });
};

export default useGet소식지 목록 조회;