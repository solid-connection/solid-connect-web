import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 멘토 mentorApi, 멘토 목록 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet멘토 목록 조회 = (defaultSize: string | number, defaultPage: string | number, params?: Record<string, any>) => {
  return useQuery<멘토 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys['멘토- mentor'].멘토 목록 조회, defaultSize, defaultPage, params],
    queryFn: () => 멘토 mentorApi.get멘토 목록 조회({ defaultSize, defaultPage, params }),
    enabled: !!defaultSize && !!defaultPage,
  });
};

export default useGet멘토 목록 조회;