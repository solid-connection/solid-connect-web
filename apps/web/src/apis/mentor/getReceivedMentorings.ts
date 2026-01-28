import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, ReceivedMentoringsResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetReceivedMentorings = (params?: Record<string, any>) => {
  return useQuery<ReceivedMentoringsResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.receivedMentorings, params],
    queryFn: () => mentorApi.getReceivedMentorings(params ? { params } : {}),
  });
};

export default useGetReceivedMentorings;