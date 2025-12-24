import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 프로필 사진 업로드 (가입 전)Request {
  // TODO: Define request type
}

export interface 프로필 사진 업로드 (가입 전)Response {
  fileUrl: string;
}

const 프로필 사진 업로드 (가입 전) = async (params: { data?: 프로필 사진 업로드 (가입 전)Request }): Promise<프로필 사진 업로드 (가입 전)Response> => {
  const res = await axiosInstance.post<프로필 사진 업로드 (가입 전)Response>(
    `{`, params?.data
  );
  return res.data;
};

const use프로필 사진 업로드 (가입 전) = () => {
  return useMutation<프로필 사진 업로드 (가입 전)Response, AxiosError, 프로필 사진 업로드 (가입 전)Request>({
    mutationFn: (data) => 프로필 사진 업로드 (가입 전)({ data }),
  });
};

export default use프로필 사진 업로드 (가입 전);