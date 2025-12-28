import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi, SignOutResponse, SignOutRequest } from "./api";

const usePostSignOut = () => {
  return useMutation<SignOutResponse, AxiosError, SignOutRequest>({
    mutationFn: (data) => authApi.postSignOut({ data }),
  });
};

export default usePostSignOut;