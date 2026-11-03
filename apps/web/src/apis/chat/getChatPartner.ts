import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { type ChatPartner, chatApi } from "./api";
import { chatKeys } from "./queryKeys";

/**
 * @description 채팅 상대방 정보를 가져오는 훅
 */
const useGetPartnerInfo = (roomId: number, userId: number) => {
  return useQuery<ChatPartner, AxiosError>({
    queryKey: chatKeys.partner(userId, roomId),
    queryFn: ({ signal }) => chatApi.getChatPartner(roomId, signal),
    staleTime: 1000 * 60 * 5,
    enabled: Number.isSafeInteger(userId) && userId > 0 && Number.isSafeInteger(roomId) && roomId > 0,
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
  });
};

export default useGetPartnerInfo;
