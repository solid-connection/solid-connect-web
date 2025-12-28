import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { scoresApi, LanguageTestListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetLanguageTestList = (params?: Record<string, any>) => {
  return useQuery<LanguageTestListResponse, AxiosError>({
    queryKey: [QueryKeys.Scores.languageTestList, params],
    queryFn: () => scoresApi.getLanguageTestList(params ? { params } : {}),
  });
};

export default useGetLanguageTestList;