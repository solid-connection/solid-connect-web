import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { chatApi, ChatPartnerResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetChatPartner = (roomId: string | number, params?: Record<string, any>) => {
  return useQuery<ChatPartnerResponse, AxiosError>({
    queryKey: [QueryKeys.chat.chatPartner, roomId, params],
    queryFn: () => chatApi.getChatPartner({ roomId, params }),
    enabled: !!roomId,
  });
};

export default useGetChatPartner;