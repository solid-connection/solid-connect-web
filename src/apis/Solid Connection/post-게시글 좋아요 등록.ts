import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 게시글 좋아요 등록Request {
  // TODO: Define request type
}

export interface 게시글 좋아요 등록Response {
  likeCount: number;
  isLiked: boolean;
}

const 게시글 좋아요 등록 = async (params: { data?: 게시글 좋아요 등록Request }): Promise<게시글 좋아요 등록Response> => {
  const res = await axiosInstance.post<게시글 좋아요 등록Response>(
    `{`, params?.data
  );
  return res.data;
};

const use게시글 좋아요 등록 = () => {
  return useMutation<게시글 좋아요 등록Response, AxiosError, 게시글 좋아요 등록Request>({
    mutationFn: (data) => 게시글 좋아요 등록({ data }),
  });
};

export default use게시글 좋아요 등록;