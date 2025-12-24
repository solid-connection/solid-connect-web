import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostSignOutRequest {
  // TODO: Define request type
}

export interface PostSignOutResponse {

}

const postSignOut = async (params: { data?: PostSignOutRequest }): Promise<PostSignOutResponse> => {
  const res = await axiosInstance.post<PostSignOutResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostSignOut = () => {
  return useMutation<PostSignOutResponse, AxiosError, PostSignOutRequest>({
    mutationFn: (data) => postSignOut({ data }),
  });
};

export default usePostSignOut;