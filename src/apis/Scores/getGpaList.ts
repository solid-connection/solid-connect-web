import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { scoresApi, GpaListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetGpaList = (params?: Record<string, any>) => {
  return useQuery<GpaListResponse, AxiosError>({
    queryKey: [QueryKeys.Scores.gpaList, params],
    queryFn: () => scoresApi.getGpaList(params ? { params } : {}),
  });
};

export default useGetGpaList;