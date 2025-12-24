import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostRefreshTokenRequest {
  // TODO: Define request type
}

export interface PostRefreshTokenResponse {
  accessToken: string;
}

const postRefreshToken = async (params: { data?: PostRefreshTokenRequest }): Promise<PostRefreshTokenResponse> => {
  const res = await axiosInstance.post<PostRefreshTokenResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostRefreshToken = () => {
  return useMutation<PostRefreshTokenResponse, AxiosError, PostRefreshTokenRequest>({
    mutationFn: (data) => postRefreshToken({ data }),
  });
};

export default usePostRefreshToken;