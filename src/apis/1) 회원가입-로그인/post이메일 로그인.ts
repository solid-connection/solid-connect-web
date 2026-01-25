import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 1) 회원가입로그인Api, 이메일 로그인Response, 이메일 로그인Request } from "./api";

const usePost이메일 로그인 = () => {
  return useMutation<이메일 로그인Response, AxiosError, 이메일 로그인Request>({
    mutationFn: (data) => 1) 회원가입로그인Api.post이메일 로그인({ data }),
  });
};

export default usePost이메일 로그인;