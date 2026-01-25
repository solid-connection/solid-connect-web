import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ChatQueryKeys, chatApi } from "./api";

/**
 * @description 채팅방 읽음 처리 훅
 */
const usePutChatRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: chatApi.putReadChatRoom,
    onSuccess: () => {
      // 채팅방 목록 쿼리를 무효화하여 새로 고침
      queryClient.invalidateQueries({ queryKey: [ChatQueryKeys.chatRooms] });
    },
    onError: (error) => {
      console.error("채팅방 진입 읽기 실패", error);
    },
  });
};

export default usePutChatRead;
