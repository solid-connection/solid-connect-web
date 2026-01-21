import { AxiosError } from "axios";

import { UploadProfileImageResponse, imageUploadApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostUploadProfileImage = () => {
  return useMutation<UploadProfileImageResponse, AxiosError, File>({
    mutationFn: (file) => imageUploadApi.postUploadProfileImage(file),
  });
};

export default usePostUploadProfileImage;
