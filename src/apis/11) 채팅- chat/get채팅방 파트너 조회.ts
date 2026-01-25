import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 11) 채팅 chatApi, 채팅방 파트너 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet채팅방 파트너 조회 = (roomId: string | number, params?: Record<string, any>) => {
  return useQuery<채팅방 파트너 조회Response, AxiosError>({
    queryKey: [QueryKeys['11) 채팅- chat'].채팅방 파트너 조회, roomId, params],
    queryFn: () => 11) 채팅 chatApi.get채팅방 파트너 조회({ roomId, params }),
    enabled: !!roomId,
  });
};

export default useGet채팅방 파트너 조회;