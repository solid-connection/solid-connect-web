import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 1) 회원가입로그인Api, 로그아웃Response, 로그아웃Request } from "./api";

const usePost로그아웃 = () => {
  return useMutation<로그아웃Response, AxiosError, 로그아웃Request>({
    mutationFn: (data) => 1) 회원가입로그인Api.post로그아웃({ data }),
  });
};

export default usePost로그아웃;