import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { image UploadApi, 프로필 사진 업로드 (가입 전)Response, 프로필 사진 업로드 (가입 전)Request } from "./api";

const usePost프로필 사진 업로드 (가입 전) = () => {
  return useMutation<프로필 사진 업로드 (가입 전)Response, AxiosError, 프로필 사진 업로드 (가입 전)Request>({
    mutationFn: (data) => image UploadApi.post프로필 사진 업로드 (가입 전)({ data }),
  });
};

export default usePost프로필 사진 업로드 (가입 전);