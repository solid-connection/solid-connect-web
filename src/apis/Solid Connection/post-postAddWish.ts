import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostAddWishRequest {
  // TODO: Define request type
}

const postAddWish = async (params: { data?: PostAddWishRequest }): Promise<PostAddWishResponse> => {
  const res = await axiosInstance.post<PostAddWishResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostAddWish = () => {
  return useMutation<PostAddWishResponse, AxiosError, PostAddWishRequest>({
    mutationFn: (data) => postAddWish({ data }),
  });
};

export default usePostAddWish;