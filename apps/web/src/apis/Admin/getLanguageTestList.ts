import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { LanguageTestListResponse, adminApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetLanguageTestList = (params?: Record<string, any>) => {
  return useQuery<LanguageTestListResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.languageTestList, params],
    queryFn: () => adminApi.getLanguageTestList(params ? { params } : {}),
  });
};

export default useGetLanguageTestList;
