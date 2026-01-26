import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { adminApi, GpaListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetGpaList = (params?: Record<string, any>) => {
  return useQuery<GpaListResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.gpaList, params],
    queryFn: () => adminApi.getGpaList(params ? { params } : {}),
  });
};

export default useGetGpaList;