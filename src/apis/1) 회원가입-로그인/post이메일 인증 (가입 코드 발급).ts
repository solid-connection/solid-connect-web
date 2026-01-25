import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 1) 회원가입로그인Api, 이메일 인증 (가입 코드 발급)Response, 이메일 인증 (가입 코드 발급)Request } from "./api";

const usePost이메일 인증 (가입 코드 발급) = () => {
  return useMutation<이메일 인증 (가입 코드 발급)Response, AxiosError, 이메일 인증 (가입 코드 발급)Request>({
    mutationFn: (data) => 1) 회원가입로그인Api.post이메일 인증 (가입 코드 발급)({ data }),
  });
};

export default usePost이메일 인증 (가입 코드 발급);