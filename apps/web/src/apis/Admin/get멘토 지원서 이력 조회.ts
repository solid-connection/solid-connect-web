import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { adminApi, 멘토 지원서 이력 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet멘토 지원서 이력 조회 = (site_user_id: string | number, params?: Record<string, any>) => {
  return useQuery<멘토 지원서 이력 조회Response, AxiosError>({
    queryKey: [QueryKeys.Admin.멘토 지원서 이력 조회, site_user_id, params],
    queryFn: () => adminApi.get멘토 지원서 이력 조회({ site_user_id, params }),
    enabled: !!site_user_id,
  });
};

export default useGet멘토 지원서 이력 조회;