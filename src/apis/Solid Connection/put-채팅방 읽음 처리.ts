import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 채팅방 읽음 처리Request {
  // TODO: Define request type
}

export interface 채팅방 읽음 처리Response {
  // TODO: Define response type
}

const 채팅방 읽음 처리 = async (params: { data?: 채팅방 읽음 처리Request }): Promise<채팅방 읽음 처리Response> => {
  const res = await axiosInstance.put<채팅방 읽음 처리Response>(
    `{`, params?.data
  );
  return res.data;
};

const use채팅방 읽음 처리 = () => {
  return useMutation<채팅방 읽음 처리Response, AxiosError, 채팅방 읽음 처리Request>({
    mutationFn: (data) => 채팅방 읽음 처리({ data }),
  });
};

export default use채팅방 읽음 처리;