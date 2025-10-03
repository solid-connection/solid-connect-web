import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import { FileResponse } from "@/types/file";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";

/**
 * @description 프로필 이미지 업로드 API 함수 (공개)
 * @param file - 업로드할 파일
 * @returns Promise<FileResponse>
 */
const uploadProfileImagePublic = async (file: File): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response: AxiosResponse<FileResponse> = await publicAxiosInstance.post("/file/profile/pre", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * @description 프로필 이미지 업로드를 위한 useMutation 커스텀 훅
 */
const useUploadProfileImagePublic = () => {
  return useMutation({
    mutationFn: uploadProfileImagePublic,
    onError: (error) => {
      console.error("프로필 이미지 업로드 실패:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    },
  });
};

export default useUploadProfileImagePublic;
