import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const putChatRead = async (roomId: number): Promise<void> => {
  const response: AxiosResponse<void> = await axiosInstance.put(`/chats/rooms/${roomId}/read`);
  return response.data;
};

const usePutChatRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putChatRead,
    onSuccess: () => {
      // 아티클 목록 쿼리를 무효화하여 새로 고침
      queryClient.invalidateQueries({ queryKey: [QueryKeys.chatRooms] });
    },
    onError: (error) => {
      console.error("채팅방 진입 읽기 실패", error);
    },
  });
};

export default usePutChatRead;
