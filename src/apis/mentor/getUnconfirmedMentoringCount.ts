import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, UnconfirmedMentoringCountResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetUnconfirmedMentoringCount = (params?: Record<string, any>) => {
  return useQuery<UnconfirmedMentoringCountResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.unconfirmedMentoringCount, params],
    queryFn: () => mentorApi.getUnconfirmedMentoringCount(params ? { params } : {}),
  });
};

export default useGetUnconfirmedMentoringCount;