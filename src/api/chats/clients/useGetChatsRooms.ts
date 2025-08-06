import { axiosInstance } from "@/utils/axiosInstance";

import { queryKey } from "./queryKey";

import { ChatRoom } from "@/types/chats";

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
    queryKey: [queryKey.chatRooms],
    queryFn: getChatRooms,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (data) => data.chatRooms,
  });
};
export default useGetChatRooms;
