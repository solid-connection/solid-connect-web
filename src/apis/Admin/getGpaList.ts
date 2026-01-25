import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { adminApi, type GpaListResponse } from "./api";

const useGetGpaList = (params?: Record<string, any>) => {
  return useQuery<GpaListResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.gpaList, params],
    queryFn: () => adminApi.getGpaList(params ? { params } : {}),
  });
};

export default useGetGpaList;
