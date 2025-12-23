import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 연결 끊기Request {
  // TODO: Define request type
}

export interface 연결 끊기Response {
  // TODO: Define response type
}

const 연결 끊기 = async (params: { data?: 연결 끊기Request }): Promise<연결 끊기Response> => {
  const res = await axiosInstance.post<연결 끊기Response>(
    `{`, params?.data
  );
  return res.data;
};

const use연결 끊기 = () => {
  return useMutation<연결 끊기Response, AxiosError, 연결 끊기Request>({
    mutationFn: (data) => 연결 끊기({ data }),
  });
};

export default use연결 끊기;