import { AxiosError } from "axios";

import { ChatQueryKeys, ChatRoom, ChatRoomListResponse, chatApi } from "./api";

import { useQuery } from "@tanstack/react-query";

/**
 * @description 채팅방 목록을 가져오는 훅
 */
const useGetChatRooms = () => {
  return useQuery<ChatRoomListResponse, AxiosError, ChatRoom[]>({
    queryKey: [ChatQueryKeys.chatRooms],
    queryFn: chatApi.getChatRooms,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (data) => data.chatRooms,
  });
};

export default useGetChatRooms;
