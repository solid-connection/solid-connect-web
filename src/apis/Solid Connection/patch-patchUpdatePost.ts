import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PatchUpdatePostRequest {
  // TODO: Define request type
}

export interface PatchUpdatePostResponse {
  id: number;
}

const patchUpdatePost = async (params: { data?: PatchUpdatePostRequest }): Promise<PatchUpdatePostResponse> => {
  const res = await axiosInstance.patch<PatchUpdatePostResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePatchUpdatePost = () => {
  return useMutation<PatchUpdatePostResponse, AxiosError, PatchUpdatePostRequest>({
    mutationFn: (data) => patchUpdatePost({ data }),
  });
};

export default usePatchUpdatePost;