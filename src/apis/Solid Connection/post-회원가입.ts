import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 회원가입Request {
  // TODO: Define request type
}

export interface 회원가입Response {
  accessToken: string;
  refreshToken: string;
}

const 회원가입 = async (params: { data?: 회원가입Request }): Promise<회원가입Response> => {
  const res = await axiosInstance.post<회원가입Response>(
    `{`, params?.data
  );
  return res.data;
};

const use회원가입 = () => {
  return useMutation<회원가입Response, AxiosError, 회원가입Request>({
    mutationFn: (data) => 회원가입({ data }),
  });
};

export default use회원가입;