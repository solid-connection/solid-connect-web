import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 이메일 로그인Request {
  // TODO: Define request type
}

export interface 이메일 로그인Response {
  accessToken: string;
  refreshToken: string;
}

const 이메일 로그인 = async (params: { data?: 이메일 로그인Request }): Promise<이메일 로그인Response> => {
  const res = await axiosInstance.post<이메일 로그인Response>(
    `{`, params?.data
  );
  return res.data;
};

const use이메일 로그인 = () => {
  return useMutation<이메일 로그인Response, AxiosError, 이메일 로그인Request>({
    mutationFn: (data) => 이메일 로그인({ data }),
  });
};

export default use이메일 로그인;