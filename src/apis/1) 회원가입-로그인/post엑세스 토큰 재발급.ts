import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 1) 회원가입로그인Api, 엑세스 토큰 재발급Response, 엑세스 토큰 재발급Request } from "./api";

const usePost엑세스 토큰 재발급 = () => {
  return useMutation<엑세스 토큰 재발급Response, AxiosError, 엑세스 토큰 재발급Request>({
    mutationFn: (data) => 1) 회원가입로그인Api.post엑세스 토큰 재발급({ data }),
  });
};

export default usePost엑세스 토큰 재발급;