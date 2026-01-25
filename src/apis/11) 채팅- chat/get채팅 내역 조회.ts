import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 11) 채팅 chatApi, 채팅 내역 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet채팅 내역 조회 = (roomId: string | number, defaultSize: string | number, defaultPage: string | number, params?: Record<string, any>) => {
  return useQuery<채팅 내역 조회Response, AxiosError>({
    queryKey: [QueryKeys['11) 채팅- chat'].채팅 내역 조회, roomId, defaultSize, defaultPage, params],
    queryFn: () => 11) 채팅 chatApi.get채팅 내역 조회({ roomId, defaultSize, defaultPage, params }),
    enabled: !!roomId && !!defaultSize && !!defaultPage,
  });
};

export default useGet채팅 내역 조회;