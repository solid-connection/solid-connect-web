import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostBlockUserRequest {
  // TODO: Define request type
}

const postBlockUser = async (params: { data?: PostBlockUserRequest }): Promise<PostBlockUserResponse> => {
  const res = await axiosInstance.post<PostBlockUserResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostBlockUser = () => {
  return useMutation<PostBlockUserResponse, AxiosError, PostBlockUserRequest>({
    mutationFn: (data) => postBlockUser({ data }),
  });
};

export default usePostBlockUser;