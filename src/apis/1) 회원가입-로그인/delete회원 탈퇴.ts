import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 1) 회원가입로그인Api, 회원 탈퇴Response, 회원 탈퇴Request } from "./api";

const useDelete회원 탈퇴 = () => {
  return useMutation<회원 탈퇴Response, AxiosError, 회원 탈퇴Request>({
    mutationFn: (data) => 1) 회원가입로그인Api.delete회원 탈퇴({ data }),
  });
};

export default useDelete회원 탈퇴;