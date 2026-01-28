import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { communityApi, CreatePostResponse, CreatePostRequest } from "./api";

const usePostCreatePost = () => {
  return useMutation<CreatePostResponse, AxiosError, CreatePostRequest>({
    mutationFn: (data) => communityApi.postCreatePost({ data }),
  });
};

export default usePostCreatePost;