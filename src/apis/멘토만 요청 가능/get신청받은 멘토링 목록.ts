import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 멘토만 요청 가능Api, 신청받은 멘토링 목록Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet신청받은 멘토링 목록 = (params?: Record<string, any>) => {
  return useQuery<신청받은 멘토링 목록Response, AxiosError>({
    queryKey: [QueryKeys.멘토만 요청 가능.신청받은 멘토링 목록, params],
    queryFn: () => 멘토만 요청 가능Api.get신청받은 멘토링 목록(params ? { params } : {}),
  });
};

export default useGet신청받은 멘토링 목록;