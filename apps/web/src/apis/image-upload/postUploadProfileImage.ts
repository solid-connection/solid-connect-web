import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { imageUploadApi, UploadProfileImageResponse, UploadProfileImageRequest } from "./api";

const usePostUploadProfileImage = () => {
  return useMutation<UploadProfileImageResponse, AxiosError, UploadProfileImageRequest>({
    mutationFn: (data) => imageUploadApi.postUploadProfileImage({ data }),
  });
};

export default usePostUploadProfileImage;