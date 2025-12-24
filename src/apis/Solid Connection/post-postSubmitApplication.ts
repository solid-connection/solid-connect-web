import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostSubmitApplicationRequest {
  // TODO: Define request type
}

export interface PostSubmitApplicationResponse {
  totalApplyCount: number;
  applyCount: number;
  appliedUniversities: AppliedUniversities;
}

const postSubmitApplication = async (params: { data?: PostSubmitApplicationRequest }): Promise<PostSubmitApplicationResponse> => {
  const res = await axiosInstance.post<PostSubmitApplicationResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostSubmitApplication = () => {
  return useMutation<PostSubmitApplicationResponse, AxiosError, PostSubmitApplicationRequest>({
    mutationFn: (data) => postSubmitApplication({ data }),
  });
};

export default usePostSubmitApplication;