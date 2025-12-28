import { AxiosError } from "axios";

import { UploadProfileImageRequest, UploadProfileImageResponse, imageUploadApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostUploadProfileImage = () => {
  return useMutation<UploadProfileImageResponse, AxiosError, UploadProfileImageRequest>({
    mutationFn: (data) => imageUploadApi.postUploadProfileImage({ data }),
  });
};

export default usePostUploadProfileImage;
