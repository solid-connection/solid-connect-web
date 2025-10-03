import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { PostIdResponse, PostUpdateRequest } from "@/types/community";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdatePostRequest {
  postId: number;
  data: PostUpdateRequest;
}

/**
 * @description 게시글 수정 API 함수
 * @param postId - 수정할 게시글의 ID
 * @param request - 게시글 수정 요청 데이터
 * @returns Promise<PostIdResponse>
 */
const updatePost = async (postId: number, request: PostUpdateRequest): Promise<PostIdResponse> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "postUpdateRequest",
    new Blob([JSON.stringify(request.postUpdateRequest)], { type: "application/json" }),
  );
  request.file.forEach((file) => {
    convertedRequest.append("file", file);
  });

  const response: AxiosResponse<PostIdResponse> = await axiosInstance.patch(`/posts/${postId}`, convertedRequest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * @description 게시글 수정을 위한 useMutation 커스텀 훅
 */
const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: UpdatePostRequest) => updatePost(postId, data),
    onSuccess: (result, variables) => {
      // 해당 게시글 상세 쿼리와 목록 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: [QueryKeys.posts, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.posts] });
      toast.success("게시글이 수정되었습니다.");
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
      toast.error("게시글 수정에 실패했습니다.");
    },
  });
};

export default useUpdatePost;
