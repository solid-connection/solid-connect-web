import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { imageUploadApi, type UploadProfileImageResponse } from "./api";

const usePostUploadProfileImage = () => {
  return useMutation<UploadProfileImageResponse, AxiosError, File>({
    mutationFn: (file) => imageUploadApi.postUploadProfileImage(file),
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
  });
};

export default usePostUploadProfileImage;
