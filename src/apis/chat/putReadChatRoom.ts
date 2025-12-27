import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { chatApi, ReadChatRoomResponse, ReadChatRoomRequest } from "./api";

const usePutReadChatRoom = () => {
  return useMutation<ReadChatRoomResponse, AxiosError, { roomId: string | number; data: ReadChatRoomRequest }>({
    mutationFn: (variables) => chatApi.putReadChatRoom(variables),
  });
};

export default usePutReadChatRoom;