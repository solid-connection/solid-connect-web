import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { FileResponse } from "@/types/file";
import { imageUploadApi } from "./api";

/**
 * @description 프로필 이미지 업로드를 위한 useMutation 커스텀 훅 (회원가입 전 공개 API)
 */
const useUploadProfileImagePublic = () => {
  return useMutation<FileResponse, AxiosError, File>({
    mutationFn: imageUploadApi.postUploadProfileImageBeforeSignup,
  });
};

export default useUploadProfileImagePublic;
