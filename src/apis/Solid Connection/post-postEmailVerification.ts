import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostEmailVerificationRequest {
  // TODO: Define request type
}

export interface PostEmailVerificationResponse {
  signUpToken: string;
}

const postEmailVerification = async (params: { data?: PostEmailVerificationRequest }): Promise<PostEmailVerificationResponse> => {
  const res = await axiosInstance.post<PostEmailVerificationResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostEmailVerification = () => {
  return useMutation<PostEmailVerificationResponse, AxiosError, PostEmailVerificationRequest>({
    mutationFn: (data) => postEmailVerification({ data }),
  });
};

export default usePostEmailVerification;