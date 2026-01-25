import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 99) 카카오 APIApi, 사용자 id 목록 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet사용자 id 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<사용자 id 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys.99) 카카오 API.사용자 id 목록 조회, params],
    queryFn: () => 99) 카카오 APIApi.get사용자 id 목록 조회(params ? { params } : {}),
  });
};

export default useGet사용자 id 목록 조회;