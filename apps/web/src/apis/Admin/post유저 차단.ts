import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, 유저 차단Response, 유저 차단Request } from "./api";

const usePost유저 차단 = () => {
  return useMutation<유저 차단Response, AxiosError, { userId: string | number; data: 유저 차단Request }>({
    mutationFn: (variables) => adminApi.post유저 차단(variables),
  });
};

export default usePost유저 차단;