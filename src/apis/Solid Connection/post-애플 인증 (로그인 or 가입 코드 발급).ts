import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 애플 인증 (로그인 or 가입 코드 발급)Request {
  // TODO: Define request type
}

export interface 애플 인증 (로그인 or 가입 코드 발급)Response {
  isRegistered: boolean;
  nickname: null;
  email: string;
  profileImageUrl: null;
  signUpToken: string;
}

const 애플 인증 (로그인 or 가입 코드 발급) = async (params: { data?: 애플 인증 (로그인 or 가입 코드 발급)Request }): Promise<애플 인증 (로그인 or 가입 코드 발급)Response> => {
  const res = await axiosInstance.post<애플 인증 (로그인 or 가입 코드 발급)Response>(
    `{`, params?.data
  );
  return res.data;
};

const use애플 인증 (로그인 or 가입 코드 발급) = () => {
  return useMutation<애플 인증 (로그인 or 가입 코드 발급)Response, AxiosError, 애플 인증 (로그인 or 가입 코드 발급)Request>({
    mutationFn: (data) => 애플 인증 (로그인 or 가입 코드 발급)({ data }),
  });
};

export default use애플 인증 (로그인 or 가입 코드 발급);