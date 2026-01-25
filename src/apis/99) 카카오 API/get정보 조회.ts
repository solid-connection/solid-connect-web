import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 99) 카카오 APIApi, 정보 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet정보 조회 = (params?: Record<string, any>) => {
  return useQuery<정보 조회Response, AxiosError>({
    queryKey: [QueryKeys.99) 카카오 API.정보 조회, params],
    queryFn: () => 99) 카카오 APIApi.get정보 조회(params ? { params } : {}),
  });
};

export default useGet정보 조회;