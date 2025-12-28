import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { GpaListResponse, adminApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetGpaList = (params?: Record<string, any>) => {
  return useQuery<GpaListResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.gpaList, params],
    queryFn: () => adminApi.getGpaList(params ? { params } : {}),
  });
};

export default useGetGpaList;
