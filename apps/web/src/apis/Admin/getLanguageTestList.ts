import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { adminApi, type LanguageTestListResponse } from "./api";

const useGetLanguageTestList = (params?: Record<string, unknown>) => {
  return useQuery<LanguageTestListResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.languageTestList, params],
    queryFn: () => adminApi.getLanguageTestList(params ? { params } : {}),
  });
};

export default useGetLanguageTestList;
