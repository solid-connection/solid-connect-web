import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 게시글 postsApi, 게시글 삭제Response, 게시글 삭제Request } from "./api";

const useDelete게시글 삭제 = () => {
  return useMutation<게시글 삭제Response, AxiosError, { postId: string | number; data: 게시글 삭제Request }>({
    mutationFn: (variables) => 게시글 postsApi.delete게시글 삭제(variables),
  });
};

export default useDelete게시글 삭제;