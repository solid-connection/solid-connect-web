import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { adminApi, MentorApplicationHistoryListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetMentorApplicationHistoryList = (site_user_id: string | number, params?: Record<string, any>) => {
  return useQuery<MentorApplicationHistoryListResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.mentorApplicationHistoryList, site_user_id, params],
    queryFn: () => adminApi.getMentorApplicationHistoryList({ site_user_id, params }),
    enabled: !!site_user_id,
  });
};

export default useGetMentorApplicationHistoryList;