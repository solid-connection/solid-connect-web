import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authApi, type RefreshTokenResponse } from "./api";

const usePostRefreshToken = () => {
  return useMutation<RefreshTokenResponse, AxiosError, void>({
    mutationFn: () => authApi.postRefreshToken(),
  });
};

export default usePostRefreshToken;
