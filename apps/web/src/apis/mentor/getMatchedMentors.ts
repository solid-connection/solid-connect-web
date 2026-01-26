import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, MatchedMentorsResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetMatchedMentors = (defaultSize: string | number, defaultPage: string | number, params?: Record<string, any>) => {
  return useQuery<MatchedMentorsResponse, AxiosError>({
    queryKey: [QueryKeys.mentor.matchedMentors, defaultSize, defaultPage, params],
    queryFn: () => mentorApi.getMatchedMentors({ defaultSize, defaultPage, params }),
    enabled: !!defaultSize && !!defaultPage,
  });
};

export default useGetMatchedMentors;