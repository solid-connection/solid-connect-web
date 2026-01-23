import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type MatchedMentorsResponse, mentorApi } from "./api";

const useGetMatchedMentors = (
  defaultSize: string | number,
  defaultPage: string | number,
  params?: Record<string, any>,
) => {
  return useQuery<MatchedMentorsResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.matchedMentors, defaultSize, defaultPage, params],
    queryFn: () => mentorApi.getMatchedMentors({ defaultSize, defaultPage, params }),
    enabled: !!defaultSize && !!defaultPage,
  });
};

export default useGetMatchedMentors;
