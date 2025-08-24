import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { ChatPartner } from "@/types/chat";

import { useQuery } from "@tanstack/react-query";

type ChatRoomListResponse = ChatPartner;

const getPartnerInfo = async (roomId: number): Promise<ChatRoomListResponse> => {
  const res = await axiosInstance.get<ChatRoomListResponse>(`/chats/rooms/${roomId}/partner`);
  return res.data;
};
const useGetPartnerInfo = (roomId: number) => {
  return useQuery<ChatRoomListResponse, Error>({
    queryKey: [QueryKeys.partnerInfo, roomId],
    queryFn: () => getPartnerInfo(roomId),
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetPartnerInfo;
