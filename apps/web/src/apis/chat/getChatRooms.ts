import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { chatApi, ChatRoomsResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetChatRooms = (params?: Record<string, any>) => {
  return useQuery<ChatRoomsResponse, AxiosError>({
    queryKey: [QueryKeys.chat.chatRooms, params],
    queryFn: () => chatApi.getChatRooms(params ? { params } : {}),
  });
};

export default useGetChatRooms;