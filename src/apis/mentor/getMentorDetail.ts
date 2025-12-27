import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, MentorDetailResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetMentorDetail = (mentorId: string | number, params?: Record<string, any>) => {
  return useQuery<MentorDetailResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.mentorDetail, mentorId, params],
    queryFn: () => mentorApi.getMentorDetail({ mentorId, params }),
    enabled: !!mentorId,
  });
};

export default useGetMentorDetail;