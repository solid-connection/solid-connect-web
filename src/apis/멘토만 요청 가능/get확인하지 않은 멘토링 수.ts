import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 멘토만 요청 가능Api, 확인하지 않은 멘토링 수Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet확인하지 않은 멘토링 수 = (params?: Record<string, any>) => {
  return useQuery<확인하지 않은 멘토링 수Response, AxiosError>({
    queryKey: [QueryKeys.멘토만 요청 가능.확인하지 않은 멘토링 수, params],
    queryFn: () => 멘토만 요청 가능Api.get확인하지 않은 멘토링 수(params ? { params } : {}),
  });
};

export default useGet확인하지 않은 멘토링 수;