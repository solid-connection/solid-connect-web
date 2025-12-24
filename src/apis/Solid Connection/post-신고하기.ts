import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 신고하기Request {
  // TODO: Define request type
}

const 신고하기 = async (params: { data?: 신고하기Request }): Promise<신고하기Response> => {
  const res = await axiosInstance.post<신고하기Response>(
    `{`, params?.data
  );
  return res.data;
};

const use신고하기 = () => {
  return useMutation<신고하기Response, AxiosError, 신고하기Request>({
    mutationFn: (data) => 신고하기({ data }),
  });
};

export default use신고하기;