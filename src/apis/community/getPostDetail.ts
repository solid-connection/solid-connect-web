import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { communityApi, CommunityQueryKeys, Post } from "./api";

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