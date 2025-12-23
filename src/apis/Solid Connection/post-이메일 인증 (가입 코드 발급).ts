import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 이메일 인증 (가입 코드 발급)Request {
  // TODO: Define request type
}

const 이메일 인증 (가입 코드 발급) = async (params: { data?: 이메일 인증 (가입 코드 발급)Request }): Promise<이메일 인증 (가입 코드 발급)Response> => {
  const res = await axiosInstance.post<이메일 인증 (가입 코드 발급)Response>(
    `{`, params?.data
  );
  return res.data;
};

const use이메일 인증 (가입 코드 발급) = () => {
  return useMutation<이메일 인증 (가입 코드 발급)Response, AxiosError, 이메일 인증 (가입 코드 발급)Request>({
    mutationFn: (data) => 이메일 인증 (가입 코드 발급)({ data }),
  });
};

export default use이메일 인증 (가입 코드 발급);