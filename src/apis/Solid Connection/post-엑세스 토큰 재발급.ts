import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 엑세스 토큰 재발급Request {
  // TODO: Define request type
}

export interface 엑세스 토큰 재발급Response {
  accessToken: string;
}

const 엑세스 토큰 재발급 = async (params: { data?: 엑세스 토큰 재발급Request }): Promise<엑세스 토큰 재발급Response> => {
  const res = await axiosInstance.post<엑세스 토큰 재발급Response>(
    `{`, params?.data
  );
  return res.data;
};

const use엑세스 토큰 재발급 = () => {
  return useMutation<엑세스 토큰 재발급Response, AxiosError, 엑세스 토큰 재발급Request>({
    mutationFn: (data) => 엑세스 토큰 재발급({ data }),
  });
};

export default use엑세스 토큰 재발급;