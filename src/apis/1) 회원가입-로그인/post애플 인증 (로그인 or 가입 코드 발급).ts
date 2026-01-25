import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 1) 회원가입로그인Api, 애플 인증 (로그인 or 가입 코드 발급)Response, 애플 인증 (로그인 or 가입 코드 발급)Request } from "./api";

const usePost애플 인증 (로그인 or 가입 코드 발급) = () => {
  return useMutation<애플 인증 (로그인 or 가입 코드 발급)Response, AxiosError, 애플 인증 (로그인 or 가입 코드 발급)Request>({
    mutationFn: (data) => 1) 회원가입로그인Api.post애플 인증 (로그인 or 가입 코드 발급)({ data }),
  });
};

export default usePost애플 인증 (로그인 or 가입 코드 발급);