import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostCreateGpaRequest {
  // TODO: Define request type
}

export interface PostCreateGpaResponse {
  id: number;
}

const postCreateGpa = async (params: { data?: PostCreateGpaRequest }): Promise<PostCreateGpaResponse> => {
  const res = await axiosInstance.post<PostCreateGpaResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostCreateGpa = () => {
  return useMutation<PostCreateGpaResponse, AxiosError, PostCreateGpaRequest>({
    mutationFn: (data) => postCreateGpa({ data }),
  });
};

export default usePostCreateGpa;