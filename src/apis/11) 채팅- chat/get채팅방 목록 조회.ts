import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 11) 채팅 chatApi, 채팅방 목록 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet채팅방 목록 조회 = (params?: Record<string, any>) => {
  return useQuery<채팅방 목록 조회Response, AxiosError>({
    queryKey: [QueryKeys['11) 채팅- chat'].채팅방 목록 조회, params],
    queryFn: () => 11) 채팅 chatApi.get채팅방 목록 조회(params ? { params } : {}),
  });
};

export default useGet채팅방 목록 조회;