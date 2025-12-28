import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi, EmailLoginResponse, EmailLoginRequest } from "./api";

const usePostEmailLogin = () => {
  return useMutation<EmailLoginResponse, AxiosError, EmailLoginRequest>({
    mutationFn: (data) => authApi.postEmailLogin({ data }),
  });
};

export default usePostEmailLogin;