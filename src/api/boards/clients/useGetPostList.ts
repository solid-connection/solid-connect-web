import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./QueryKeys";

import { ListPost } from "@/types/community";

import { useQuery } from "@tanstack/react-query";

interface UseGetPostListProps {
  boardCode: string;
  category?: string | null;
}

const getPostList = (boardCode: string, category: string | null = null): Promise<AxiosResponse<ListPost[]>> =>
  axiosInstance.get(`/boards/${boardCode}`, {
    params: {
      category,
    },
  });

const useGetPostList = ({ boardCode, category = null }: UseGetPostListProps) => {
  return useQuery({
    queryKey: [QueryKeys.postList],
    queryFn: () => getPostList(boardCode, category),
    // staleTime을 무한으로 설정하여 불필요한 자동 refetch를 방지합니다.
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 예: 30분
    select: (response) => response.data, // response.data가 실제 ListPost[]
  });
};

export default useGetPostList;
