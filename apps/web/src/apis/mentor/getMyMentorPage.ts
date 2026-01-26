import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, MyMentorPageResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetMyMentorPage = (params?: Record<string, any>) => {
  return useQuery<MyMentorPageResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.myMentorPage, params],
    queryFn: () => mentorApi.getMyMentorPage(params ? { params } : {}),
  });
};

export default useGetMyMentorPage;