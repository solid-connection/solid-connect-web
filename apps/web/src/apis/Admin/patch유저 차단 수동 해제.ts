import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, 유저 차단 수동 해제Response, 유저 차단 수동 해제Request } from "./api";

const usePatch유저 차단 수동 해제 = () => {
  return useMutation<유저 차단 수동 해제Response, AxiosError, { userId: string | number; data: 유저 차단 수동 해제Request }>({
    mutationFn: (variables) => adminApi.patch유저 차단 수동 해제(variables),
  });
};

export default usePatch유저 차단 수동 해제;