import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 8) 사용자Api, 유저 차단 취소Response, 유저 차단 취소Request } from "./api";

const useDelete유저 차단 취소 = () => {
  return useMutation<유저 차단 취소Response, AxiosError, { blockedId: string | number; data: 유저 차단 취소Request }>({
    mutationFn: (variables) => 8) 사용자Api.delete유저 차단 취소(variables),
  });
};

export default useDelete유저 차단 취소;