import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 8) 사용자Api, 유저 차단Response, 유저 차단Request } from "./api";

const usePost유저 차단 = () => {
  return useMutation<유저 차단Response, AxiosError, { blockedId: string | number; data: 유저 차단Request }>({
    mutationFn: (variables) => 8) 사용자Api.post유저 차단(variables),
  });
};

export default usePost유저 차단;