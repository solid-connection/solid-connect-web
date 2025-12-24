import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostUploadProfileImageRequest {
  // TODO: Define request type
}

export interface PostUploadProfileImageResponse {
  fileUrl: string;
}

const postUploadProfileImage = async (params: { data?: PostUploadProfileImageRequest }): Promise<PostUploadProfileImageResponse> => {
  const res = await axiosInstance.post<PostUploadProfileImageResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostUploadProfileImage = () => {
  return useMutation<PostUploadProfileImageResponse, AxiosError, PostUploadProfileImageRequest>({
    mutationFn: (data) => postUploadProfileImage({ data }),
  });
};

export default usePostUploadProfileImage;