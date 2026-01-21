import { AxiosError } from "axios";

import { CommunityQueryKeys, Post, communityApi } from "./api";

import { useQuery } from "@tanstack/react-query";

/**
 * @description 게시글 상세 조회를 위한 useQuery 커스텀 훅
 */
const useGetPostDetail = (postId: number) => {
  return useQuery<Post, AxiosError>({
    queryKey: [CommunityQueryKeys.posts, postId],
    queryFn: () => communityApi.getPostDetail(postId),
    enabled: !!postId,
  });
};

export default useGetPostDetail;
