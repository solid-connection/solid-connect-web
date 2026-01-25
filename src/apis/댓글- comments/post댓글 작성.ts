import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 댓글 commentsApi, 댓글 작성Response, 댓글 작성Request } from "./api";

const usePost댓글 작성 = () => {
  return useMutation<댓글 작성Response, AxiosError, 댓글 작성Request>({
    mutationFn: (data) => 댓글 commentsApi.post댓글 작성({ data }),
  });
};

export default usePost댓글 작성;