import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostApplyMentoringRequest {
  // TODO: Define request type
}

export interface PostApplyMentoringResponse {
  mentoringId: number;
}

const postApplyMentoring = async (params: { data?: PostApplyMentoringRequest }): Promise<PostApplyMentoringResponse> => {
  const res = await axiosInstance.post<PostApplyMentoringResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostApplyMentoring = () => {
  return useMutation<PostApplyMentoringResponse, AxiosError, PostApplyMentoringRequest>({
    mutationFn: (data) => postApplyMentoring({ data }),
  });
};

export default usePostApplyMentoring;