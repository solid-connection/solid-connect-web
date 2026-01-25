import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { communityApi, UpdatePostResponse, UpdatePostRequest } from "./api";

const usePatchUpdatePost = () => {
  return useMutation<UpdatePostResponse, AxiosError, { postId: string | number; data: UpdatePostRequest }>({
    mutationFn: (variables) => communityApi.patchUpdatePost(variables),
  });
};

export default usePatchUpdatePost;