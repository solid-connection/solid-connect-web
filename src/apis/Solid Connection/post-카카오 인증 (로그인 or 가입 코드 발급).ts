import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 카카오 인증 (로그인 or 가입 코드 발급)Request {
  // TODO: Define request type
}

const 카카오 인증 (로그인 or 가입 코드 발급) = async (params: { data?: 카카오 인증 (로그인 or 가입 코드 발급)Request }): Promise<카카오 인증 (로그인 or 가입 코드 발급)Response> => {
  const res = await axiosInstance.post<카카오 인증 (로그인 or 가입 코드 발급)Response>(
    `{`, params?.data
  );
  return res.data;
};

const use카카오 인증 (로그인 or 가입 코드 발급) = () => {
  return useMutation<카카오 인증 (로그인 or 가입 코드 발급)Response, AxiosError, 카카오 인증 (로그인 or 가입 코드 발급)Request>({
    mutationFn: (data) => 카카오 인증 (로그인 or 가입 코드 발급)({ data }),
  });
};

export default use카카오 인증 (로그인 or 가입 코드 발급);