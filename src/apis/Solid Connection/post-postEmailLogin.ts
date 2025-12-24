import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostEmailLoginRequest {
  // TODO: Define request type
}

export interface PostEmailLoginResponse {
  accessToken: string;
  refreshToken: string;
}

const postEmailLogin = async (params: { data?: PostEmailLoginRequest }): Promise<PostEmailLoginResponse> => {
  const res = await axiosInstance.post<PostEmailLoginResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostEmailLogin = () => {
  return useMutation<PostEmailLoginResponse, AxiosError, PostEmailLoginRequest>({
    mutationFn: (data) => postEmailLogin({ data }),
  });
};

export default usePostEmailLogin;