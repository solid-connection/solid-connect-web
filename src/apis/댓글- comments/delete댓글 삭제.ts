import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 댓글 commentsApi, 댓글 삭제Response, 댓글 삭제Request } from "./api";

const useDelete댓글 삭제 = () => {
  return useMutation<댓글 삭제Response, AxiosError, { commentId: string | number; data: 댓글 삭제Request }>({
    mutationFn: (variables) => 댓글 commentsApi.delete댓글 삭제(variables),
  });
};

export default useDelete댓글 삭제;