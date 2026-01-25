import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 멘티만 요청 가능Api, 신청한 멘토링 목록Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet신청한 멘토링 목록 = (verifyStatus: string | number, defaultSize: string | number, defaultPage: string | number, params?: Record<string, any>) => {
  return useQuery<신청한 멘토링 목록Response, AxiosError>({
    queryKey: [QueryKeys.멘티만 요청 가능.신청한 멘토링 목록, verifyStatus, defaultSize, defaultPage, params],
    queryFn: () => 멘티만 요청 가능Api.get신청한 멘토링 목록({ verifyStatus, defaultSize, defaultPage, params }),
    enabled: !!verifyStatus && !!defaultSize && !!defaultPage,
  });
};

export default useGet신청한 멘토링 목록;