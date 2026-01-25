import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 6) 성적 등록Api, 학점 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet학점 조회 = (params?: Record<string, any>) => {
  return useQuery<학점 조회Response, AxiosError>({
    queryKey: [QueryKeys.6) 성적 등록.학점 조회, params],
    queryFn: () => 6) 성적 등록Api.get학점 조회(params ? { params } : {}),
  });
};

export default useGet학점 조회;