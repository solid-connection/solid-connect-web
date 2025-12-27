import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { adminApi, LanguageTestListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetLanguageTestList = (params?: Record<string, any>) => {
  return useQuery<LanguageTestListResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.languageTestList, params],
    queryFn: () => adminApi.getLanguageTestList(params ? { params } : {}),
  });
};

export default useGetLanguageTestList;