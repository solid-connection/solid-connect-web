import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { ChatRoom } from "@/types/chat";

import { useQuery } from "@tanstack/react-query";

export interface ChatRoomListResponse {
  chatRooms: ChatRoom[];
}

const getChatRooms = async () => {
  const res = await axiosInstance.get<ChatRoomListResponse>("/chats/rooms");
  return res.data;
};
const useGetChatRooms = () => {
  return useQuery({
    queryKey: [QueryKeys.chatRooms],
    queryFn: getChatRooms,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (data) => data.chatRooms,
  });
};
export default useGetChatRooms;
