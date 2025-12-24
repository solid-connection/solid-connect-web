import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 게시글 작성Request {
  // TODO: Define request type
}

const 게시글 작성 = async (params: { data?: 게시글 작성Request }): Promise<게시글 작성Response> => {
  const res = await axiosInstance.post<게시글 작성Response>(
    `{`, params?.data
  );
  return res.data;
};

const use게시글 작성 = () => {
  return useMutation<게시글 작성Response, AxiosError, 게시글 작성Request>({
    mutationFn: (data) => 게시글 작성({ data }),
  });
};

export default use게시글 작성;