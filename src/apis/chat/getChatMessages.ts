import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { chatApi, ChatMessagesResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetChatMessages = (roomId: string | number, defaultSize: string | number, defaultPage: string | number, params?: Record<string, any>) => {
  return useQuery<ChatMessagesResponse, AxiosError>({
    queryKey: [QueryKeys.chat.chatMessages, roomId, defaultSize, defaultPage, params],
    queryFn: () => chatApi.getChatMessages({ roomId, defaultSize, defaultPage, params }),
    enabled: !!roomId && !!defaultSize && !!defaultPage,
  });
};

export default useGetChatMessages;