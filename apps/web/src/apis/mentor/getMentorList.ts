import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, MentorListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetMentorList = (defaultSize: string | number, defaultPage: string | number, params?: Record<string, any>) => {
  return useQuery<MentorListResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.mentorList, defaultSize, defaultPage, params],
    queryFn: () => mentorApi.getMentorList({ defaultSize, defaultPage, params }),
    enabled: !!defaultSize && !!defaultPage,
  });
};

export default useGetMentorList;