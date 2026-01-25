import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, UnconfirmedMentoringCountResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetUnconfirmedMentoringCount = (enabled: boolean = true) => {
  return useQuery<UnconfirmedMentoringCountResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.unconfirmedMentoringCount],
    queryFn: () => mentorApi.getUnconfirmedMentoringCount({}),
    enabled,
  });
};

export default useGetUnconfirmedMentoringCount;