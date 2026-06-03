import type { ListPost } from "@/types/community";
import { CommunityQueryKeys } from "./queryKeys";

export const COMMUNITY_INITIAL_CATEGORY = "전체";
export const COMMUNITY_POST_LIST_STALE_TIME = Infinity;
export const COMMUNITY_POST_LIST_GC_TIME = 1000 * 60 * 30; // 30분

export const communityPostListQueryKey = (boardCode: string, category: string | null = null) =>
  [CommunityQueryKeys.postList, boardCode, category] as const;

export const sortCommunityPosts = (posts: ListPost[]) =>
  [...posts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
