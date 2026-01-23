import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { imageUploadApi, type UploadProfileImageResponse } from "./api";

const usePostUploadProfileImage = () => {
  return useMutation<UploadProfileImageResponse, AxiosError, File>({
    mutationFn: (file) => imageUploadApi.postUploadProfileImage(file),
  });
};

export default usePostUploadProfileImage;
