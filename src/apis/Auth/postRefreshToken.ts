import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi, RefreshTokenResponse, RefreshTokenRequest } from "./api";

const usePostRefreshToken = () => {
  return useMutation<RefreshTokenResponse, AxiosError, RefreshTokenRequest>({
    mutationFn: (data) => authApi.postRefreshToken({ data }),
  });
};

export default usePostRefreshToken;