import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { imageUploadApi } from "./api";

const useUploadChatImages = () => {
  return useMutation<string[], AxiosError, File[]>({
    mutationFn: (files) => imageUploadApi.postUploadChatImages(files),
    meta: SKIP_GLOBAL_ERROR_TOAST_META,
  });
};

export default useUploadChatImages;
