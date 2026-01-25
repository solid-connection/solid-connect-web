import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 11) 채팅 chatApi, 채팅방 읽음 처리Response, 채팅방 읽음 처리Request } from "./api";

const usePut채팅방 읽음 처리 = () => {
  return useMutation<채팅방 읽음 처리Response, AxiosError, { roomId: string | number; data: 채팅방 읽음 처리Request }>({
    mutationFn: (variables) => 11) 채팅 chatApi.put채팅방 읽음 처리(variables),
  });
};

export default usePut채팅방 읽음 처리;