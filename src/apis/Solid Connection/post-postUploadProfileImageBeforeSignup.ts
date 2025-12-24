import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostUploadProfileImageBeforeSignupRequest {
  // TODO: Define request type
}

export interface PostUploadProfileImageBeforeSignupResponse {
  fileUrl: string;
}

const postUploadProfileImageBeforeSignup = async (params: { data?: PostUploadProfileImageBeforeSignupRequest }): Promise<PostUploadProfileImageBeforeSignupResponse> => {
  const res = await axiosInstance.post<PostUploadProfileImageBeforeSignupResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostUploadProfileImageBeforeSignup = () => {
  return useMutation<PostUploadProfileImageBeforeSignupResponse, AxiosError, PostUploadProfileImageBeforeSignupRequest>({
    mutationFn: (data) => postUploadProfileImageBeforeSignup({ data }),
  });
};

export default usePostUploadProfileImageBeforeSignup;