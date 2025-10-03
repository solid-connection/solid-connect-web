import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { PostCreateRequest, PostIdResponse } from "@/types/community";

import { toast } from "@/lib/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 게시글 생성 API 함수
 * @param request - 게시글 생성 요청 데이터
 * @returns Promise<PostIdResponse>
 */
const createPost = async (request: PostCreateRequest): Promise<PostIdResponse> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "postCreateRequest",
    new Blob([JSON.stringify(request.postCreateRequest)], { type: "application/json" }),
  );
  request.file.forEach((file) => {
    convertedRequest.append("file", file);
  });

  const response: AxiosResponse<PostIdResponse> = await axiosInstance.post(`/posts`, convertedRequest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * @description 게시글 생성을 위한 useMutation 커스텀 훅
 */
const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 게시글 목록 쿼리를 무효화하여 최신 목록 반영
      queryClient.invalidateQueries({ queryKey: [QueryKeys.posts] });
      toast.success("게시글이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      toast.error("게시글 등록에 실패했습니다.");
    },
  });
};

export default useCreatePost;
