import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 슬랙 알림Request {
  // TODO: Define request type
}

export interface 슬랙 알림Response {
  // TODO: Define response type
}

const 슬랙 알림 = async (params: { data?: 슬랙 알림Request }): Promise<슬랙 알림Response> => {
  const res = await axiosInstance.post<슬랙 알림Response>(
    `{`, params?.data
  );
  return res.data;
};

const use슬랙 알림 = () => {
  return useMutation<슬랙 알림Response, AxiosError, 슬랙 알림Request>({
    mutationFn: (data) => 슬랙 알림({ data }),
  });
};

export default use슬랙 알림;