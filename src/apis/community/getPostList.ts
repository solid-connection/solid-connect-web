import { AxiosResponse } from "axios";

import { CommunityQueryKeys, communityApi } from "./api";

import { ListPost } from "@/types/community";

import { useQuery } from "@tanstack/react-query";

interface UseGetPostListProps {
  boardCode: string;
  category?: string | null;
}

/**
 * @description 게시글 목록 조회 훅
 */
const useGetPostList = ({ boardCode, category = null }: UseGetPostListProps) => {
  return useQuery({
    queryKey: [CommunityQueryKeys.postList, boardCode, category],
    queryFn: () => communityApi.getPostList(boardCode, category),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30분
    select: (response) => {
      return [...response.data].sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    },
  });
};

export default useGetPostList;
