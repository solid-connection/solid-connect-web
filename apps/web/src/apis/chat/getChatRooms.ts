import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { type ChatRoom, type ChatRoomListResponse, chatApi } from "./api";
import { useChatUserId } from "./auth";
import { chatKeys } from "./queryKeys";

/**
 * @description 채팅방 목록을 가져오는 훅
 */
const useGetChatRooms = (contextUserId?: number) => {
  const authenticatedUserId = useChatUserId();
  const userId = contextUserId ?? authenticatedUserId;

  return useQuery<ChatRoomListResponse, AxiosError, ChatRoom[]>({
    queryKey: chatKeys.rooms(userId),
    queryFn: ({ signal }) => chatApi.getChatRooms(signal),
    enabled: userId !== null,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
    select: (data) => data.chatRooms,
  });
};

export default useGetChatRooms;
