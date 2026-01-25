import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, AppliedMentoringsResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetAppliedMentorings = (verifyStatus: string | number, defaultSize: string | number, defaultPage: string | number, params?: Record<string, any>) => {
  return useQuery<AppliedMentoringsResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.appliedMentorings, verifyStatus, defaultSize, defaultPage, params],
    queryFn: () => mentorApi.getAppliedMentorings({ verifyStatus, defaultSize, defaultPage, params }),
    enabled: !!verifyStatus && !!defaultSize && !!defaultPage,
  });
};

export default useGetAppliedMentorings;