import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 멘토 mentorApi, 멘토 상세 페이지Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet멘토 상세 페이지 = (mentorId: string | number, params?: Record<string, any>) => {
  return useQuery<멘토 상세 페이지Response, AxiosError>({
    queryKey: [QueryKeys['멘토- mentor'].멘토 상세 페이지, mentorId, params],
    queryFn: () => 멘토 mentorApi.get멘토 상세 페이지({ mentorId, params }),
    enabled: !!mentorId,
  });
};

export default useGet멘토 상세 페이지;