import { queryOptions, useQuery } from "@tanstack/react-query";

import { communityApi } from "./api";
import {
  COMMUNITY_POST_LIST_GC_TIME,
  COMMUNITY_POST_LIST_STALE_TIME,
  communityPostListQueryKey,
  sortCommunityPosts,
} from "./postListQuery";

interface UseGetPostListProps {
  boardCode: string;
  category?: string | null;
}

export const getPostListQueryOptions = ({ boardCode, category = null }: UseGetPostListProps) =>
  queryOptions({
    queryKey: communityPostListQueryKey(boardCode, category),
    queryFn: async () => {
      const response = await communityApi.getPostList(boardCode, category);
      return sortCommunityPosts(response.data);
    },
    staleTime: COMMUNITY_POST_LIST_STALE_TIME,
    gcTime: COMMUNITY_POST_LIST_GC_TIME,
  });

/**
 * @description 게시글 목록 조회 훅
 */
const useGetPostList = ({ boardCode, category = null }: UseGetPostListProps) => {
  return useQuery(getPostListQueryOptions({ boardCode, category }));
};

export default useGetPostList;
