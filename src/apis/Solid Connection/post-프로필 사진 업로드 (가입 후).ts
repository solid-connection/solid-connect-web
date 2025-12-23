import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 프로필 사진 업로드 (가입 후)Request {
  // TODO: Define request type
}

const 프로필 사진 업로드 (가입 후) = async (params: { data?: 프로필 사진 업로드 (가입 후)Request }): Promise<프로필 사진 업로드 (가입 후)Response> => {
  const res = await axiosInstance.post<프로필 사진 업로드 (가입 후)Response>(
    `{`, params?.data
  );
  return res.data;
};

const use프로필 사진 업로드 (가입 후) = () => {
  return useMutation<프로필 사진 업로드 (가입 후)Response, AxiosError, 프로필 사진 업로드 (가입 후)Request>({
    mutationFn: (data) => 프로필 사진 업로드 (가입 후)({ data }),
  });
};

export default use프로필 사진 업로드 (가입 후);