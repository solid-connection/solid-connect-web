import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { adminApi, CountMentorApplicationByStatusResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetCountMentorApplicationByStatus = (params?: Record<string, any>) => {
  return useQuery<CountMentorApplicationByStatusResponse, AxiosError>({
    queryKey: [QueryKeys.Admin.countMentorApplicationByStatus, params],
    queryFn: () => adminApi.getCountMentorApplicationByStatus(params ? { params } : {}),
  });
};

export default useGetCountMentorApplicationByStatus;