import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 8) 사용자Api, 닉네임 중복 검증Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet닉네임 중복 검증 = (params?: Record<string, any>) => {
  return useQuery<닉네임 중복 검증Response, AxiosError>({
    queryKey: [QueryKeys.8) 사용자.닉네임 중복 검증, params],
    queryFn: () => 8) 사용자Api.get닉네임 중복 검증(params ? { params } : {}),
  });
};

export default useGet닉네임 중복 검증;