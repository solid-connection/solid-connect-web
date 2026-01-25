import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 7) 어드민Api, 학점조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet학점조회 = (params?: Record<string, any>) => {
  return useQuery<학점조회Response, AxiosError>({
    queryKey: [QueryKeys.7) 어드민.학점조회, params],
    queryFn: () => 7) 어드민Api.get학점조회(params ? { params } : {}),
  });
};

export default useGet학점조회;