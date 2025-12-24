import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PatchUpdateCommentRequest {
  // TODO: Define request type
}

export interface PatchUpdateCommentResponse {
  id: number;
}

const patchUpdateComment = async (params: { data?: PatchUpdateCommentRequest }): Promise<PatchUpdateCommentResponse> => {
  const res = await axiosInstance.patch<PatchUpdateCommentResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePatchUpdateComment = () => {
  return useMutation<PatchUpdateCommentResponse, AxiosError, PatchUpdateCommentRequest>({
    mutationFn: (data) => patchUpdateComment({ data }),
  });
};

export default usePatchUpdateComment;