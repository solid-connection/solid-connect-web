import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 게시글 postsApi, 게시글 수정Response, 게시글 수정Request } from "./api";

const usePatch게시글 수정 = () => {
  return useMutation<게시글 수정Response, AxiosError, { postId: string | number; data: 게시글 수정Request }>({
    mutationFn: (variables) => 게시글 postsApi.patch게시글 수정(variables),
  });
};

export default usePatch게시글 수정;