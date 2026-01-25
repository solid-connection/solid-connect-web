import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 7) 어드민Api, 어학 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet어학 조회 = (params?: Record<string, any>) => {
  return useQuery<어학 조회Response, AxiosError>({
    queryKey: [QueryKeys.7) 어드민.어학 조회, params],
    queryFn: () => 7) 어드민Api.get어학 조회(params ? { params } : {}),
  });
};

export default useGet어학 조회;