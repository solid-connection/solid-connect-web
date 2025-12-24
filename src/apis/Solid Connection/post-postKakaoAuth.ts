import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostKakaoAuthRequest {
  // TODO: Define request type
}

export interface PostKakaoAuthResponse {
  isRegistered: boolean;
  nickname: string;
  email: string;
  profileImageUrl: string;
  signUpToken: string;
}

const postKakaoAuth = async (params: { data?: PostKakaoAuthRequest }): Promise<PostKakaoAuthResponse> => {
  const res = await axiosInstance.post<PostKakaoAuthResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostKakaoAuth = () => {
  return useMutation<PostKakaoAuthResponse, AxiosError, PostKakaoAuthRequest>({
    mutationFn: (data) => postKakaoAuth({ data }),
  });
};

export default usePostKakaoAuth;