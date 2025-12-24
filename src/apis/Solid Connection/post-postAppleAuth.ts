import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostAppleAuthRequest {
  // TODO: Define request type
}

export interface PostAppleAuthResponse {
  isRegistered: boolean;
  nickname: null;
  email: string;
  profileImageUrl: null;
  signUpToken: string;
}

const postAppleAuth = async (params: { data?: PostAppleAuthRequest }): Promise<PostAppleAuthResponse> => {
  const res = await axiosInstance.post<PostAppleAuthResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostAppleAuth = () => {
  return useMutation<PostAppleAuthResponse, AxiosError, PostAppleAuthRequest>({
    mutationFn: (data) => postAppleAuth({ data }),
  });
};

export default usePostAppleAuth;