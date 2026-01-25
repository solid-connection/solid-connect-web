import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 멘토만 요청 가능Api, 나의 멘토 페이지 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet나의 멘토 페이지 조회 = (params?: Record<string, any>) => {
  return useQuery<나의 멘토 페이지 조회Response, AxiosError>({
    queryKey: [QueryKeys.멘토만 요청 가능.나의 멘토 페이지 조회, params],
    queryFn: () => 멘토만 요청 가능Api.get나의 멘토 페이지 조회(params ? { params } : {}),
  });
};

export default useGet나의 멘토 페이지 조회;