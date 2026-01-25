import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 6) 성적 등록Api, 어학 성적 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet어학 성적 조회 = (params?: Record<string, any>) => {
  return useQuery<어학 성적 조회Response, AxiosError>({
    queryKey: [QueryKeys.6) 성적 등록.어학 성적 조회, params],
    queryFn: () => 6) 성적 등록Api.get어학 성적 조회(params ? { params } : {}),
  });
};

export default useGet어학 성적 조회;