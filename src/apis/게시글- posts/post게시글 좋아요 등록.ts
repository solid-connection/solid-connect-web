import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 게시글 postsApi, 게시글 좋아요 등록Response, 게시글 좋아요 등록Request } from "./api";

const usePost게시글 좋아요 등록 = () => {
  return useMutation<게시글 좋아요 등록Response, AxiosError, { postId: string | number; data: 게시글 좋아요 등록Request }>({
    mutationFn: (variables) => 게시글 postsApi.post게시글 좋아요 등록(variables),
  });
};

export default usePost게시글 좋아요 등록;