import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 1) 회원가입로그인Api, 회원가입Response, 회원가입Request } from "./api";

const usePost회원가입 = () => {
  return useMutation<회원가입Response, AxiosError, 회원가입Request>({
    mutationFn: (data) => 1) 회원가입로그인Api.post회원가입({ data }),
  });
};

export default usePost회원가입;