import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 대학 universitiesApi, 권역국가에 해당하는 전체 대학Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet권역국가에 해당하는 전체 대학 = (params?: Record<string, any>) => {
  return useQuery<권역국가에 해당하는 전체 대학Response, AxiosError>({
    queryKey: [QueryKeys['대학- universities'].권역국가에 해당하는 전체 대학, params],
    queryFn: () => 대학 universitiesApi.get권역국가에 해당하는 전체 대학(params ? { params } : {}),
  });
};

export default useGet권역국가에 해당하는 전체 대학;