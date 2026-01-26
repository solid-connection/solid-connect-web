import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi, AppleAuthResponse, AppleAuthRequest } from "./api";

const usePostAppleAuth = () => {
  return useMutation<AppleAuthResponse, AxiosError, AppleAuthRequest>({
    mutationFn: (data) => authApi.postAppleAuth({ data }),
  });
};

export default usePostAppleAuth;