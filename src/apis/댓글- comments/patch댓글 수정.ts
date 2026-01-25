import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 댓글 commentsApi, 댓글 수정Response, 댓글 수정Request } from "./api";

const usePatch댓글 수정 = () => {
  return useMutation<댓글 수정Response, AxiosError, { commentId: string | number; data: 댓글 수정Request }>({
    mutationFn: (variables) => 댓글 commentsApi.patch댓글 수정(variables),
  });
};

export default usePatch댓글 수정;