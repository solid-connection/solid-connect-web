import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface 게시글 좋아요 삭제Request {
  // TODO: Define request type
}

const 게시글 좋아요 삭제 = async (): Promise<게시글 좋아요 삭제Response> => {
  const res = await axiosInstance.delete<게시글 좋아요 삭제Response>(
    `{`
  );
  return res.data;
};

const use게시글 좋아요 삭제 = () => {
  return useMutation<게시글 좋아요 삭제Response, AxiosError, 게시글 좋아요 삭제Request>({
    mutationFn: (data) => 게시글 좋아요 삭제({ data }),
  });
};

export default use게시글 좋아요 삭제;