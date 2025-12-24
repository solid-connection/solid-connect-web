import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostSignUpRequest {
  // TODO: Define request type
}

export interface PostSignUpResponse {
  accessToken: string;
  refreshToken: string;
}

const postSignUp = async (params: { data?: PostSignUpRequest }): Promise<PostSignUpResponse> => {
  const res = await axiosInstance.post<PostSignUpResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostSignUp = () => {
  return useMutation<PostSignUpResponse, AxiosError, PostSignUpRequest>({
    mutationFn: (data) => postSignUp({ data }),
  });
};

export default usePostSignUp;