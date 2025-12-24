import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PatchReadChatRoomRequest {
  // TODO: Define request type
}

export interface PatchReadChatRoomResponse {
  // TODO: Define response type
}

const patchReadChatRoom = async (params: { data?: PatchReadChatRoomRequest }): Promise<PatchReadChatRoomResponse> => {
  const res = await axiosInstance.put<PatchReadChatRoomResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePatchReadChatRoom = () => {
  return useMutation<PatchReadChatRoomResponse, AxiosError, PatchReadChatRoomRequest>({
    mutationFn: (data) => patchReadChatRoom({ data }),
  });
};

export default usePatchReadChatRoom;