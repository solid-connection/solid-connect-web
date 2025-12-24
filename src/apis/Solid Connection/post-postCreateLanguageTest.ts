import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostCreateLanguageTestRequest {
  // TODO: Define request type
}

export interface PostCreateLanguageTestResponse {
  id: number;
}

const postCreateLanguageTest = async (params: { data?: PostCreateLanguageTestRequest }): Promise<PostCreateLanguageTestResponse> => {
  const res = await axiosInstance.post<PostCreateLanguageTestResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostCreateLanguageTest = () => {
  return useMutation<PostCreateLanguageTestResponse, AxiosError, PostCreateLanguageTestRequest>({
    mutationFn: (data) => postCreateLanguageTest({ data }),
  });
};

export default usePostCreateLanguageTest;