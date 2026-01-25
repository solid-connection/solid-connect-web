import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 게시글 postsApi, 게시글 작성Response, 게시글 작성Request } from "./api";

const usePost게시글 작성 = () => {
  return useMutation<게시글 작성Response, AxiosError, 게시글 작성Request>({
    mutationFn: (data) => 게시글 postsApi.post게시글 작성({ data }),
  });
};

export default usePost게시글 작성;