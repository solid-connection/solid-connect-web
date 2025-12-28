import { AxiosError } from "axios";

import { RefreshTokenRequest, RefreshTokenResponse, authApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostRefreshToken = () => {
  return useMutation<RefreshTokenResponse, AxiosError, void>({
    mutationFn: () => authApi.postRefreshToken(),
  });
};

export default usePostRefreshToken;
