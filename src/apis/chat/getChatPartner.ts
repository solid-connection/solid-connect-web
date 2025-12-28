import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { chatApi, ChatQueryKeys, ChatPartner } from "./api";

/**
 * @description 채팅 상대방 정보를 가져오는 훅
 */
const useGetPartnerInfo = (roomId: number) => {
  return useQuery<ChatPartner, AxiosError>({
    queryKey: [ChatQueryKeys.partnerInfo, roomId],
    queryFn: () => chatApi.getChatPartner(roomId),
    staleTime: 1000 * 60 * 5,
    enabled: !!roomId,
  });
};

export default useGetPartnerInfo;