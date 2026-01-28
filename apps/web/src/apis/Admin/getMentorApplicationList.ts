import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { adminApi, MentorApplicationListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetMentorApplicationList = (params?: Record<string, any>) => {
  return useQuery<MentorApplicationListResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.mentorApplicationList, params],
    queryFn: () => adminApi.getMentorApplicationList(params ? { params } : {}),
  });
};

export default useGetMentorApplicationList;