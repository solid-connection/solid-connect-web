import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { Post } from "@/types/community";

import { useQuery } from "@tanstack/react-query";

/**
 * @description 게시글 상세 조회 API 함수
 * @param postId - 조회할 게시글의 ID
 * @returns Promise<Post>
 */
const getPostDetail = async (postId: number): Promise<Post> => {
  const response: AxiosResponse<Post> = await axiosInstance.get(`/posts/${postId}`);
  return response.data;
};

/**
 * @description 게시글 상세 조회를 위한 useQuery 커스텀 훅
 */
const useGetPostDetail = (postId: number) => {
  return useQuery({
    queryKey: [QueryKeys.posts, postId],
    queryFn: () => getPostDetail(postId),
    enabled: !!postId,
  });
};

export default useGetPostDetail;
