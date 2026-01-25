import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 멘티만 요청 가능Api, 매칭된 멘토 목록Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet매칭된 멘토 목록 = (defaultSize: string | number, defaultPage: string | number, params?: Record<string, any>) => {
  return useQuery<매칭된 멘토 목록Response, AxiosError>({
    queryKey: [QueryKeys.멘티만 요청 가능.매칭된 멘토 목록, defaultSize, defaultPage, params],
    queryFn: () => 멘티만 요청 가능Api.get매칭된 멘토 목록({ defaultSize, defaultPage, params }),
    enabled: !!defaultSize && !!defaultPage,
  });
};

export default useGet매칭된 멘토 목록;