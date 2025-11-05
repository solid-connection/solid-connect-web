import { AxiosResponse } from "axios";

import { publicAxiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./QueryKeys";

import { ListPost } from "@/types/community";

import { useQuery } from "@tanstack/react-query";

interface UseGetPostListProps {
  boardCode: string;
  category?: string | null;
  initialData?: ListPost[];
}

const getPostList = (boardCode: string, category: string | null = null): Promise<AxiosResponse<ListPost[]>> =>
  publicAxiosInstance.get(`/boards/${boardCode}`, {
    params: {
      category,
    },
  });

const useGetPostList = ({ boardCode, category = null, initialData }: UseGetPostListProps) => {
  return useQuery({
    queryKey: [QueryKeys.postList, boardCode, category],
    queryFn: () => getPostList(boardCode, category),
    // ISR로 받은 initialData가 있으면 사용
    ...(initialData && {
      initialData: { data: initialData } as AxiosResponse<ListPost[]>,
    }),
    // staleTime을 무한으로 설정하여 불필요한 자동 refetch를 방지합니다.
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 예: 30분
    select: (response) => {
      return [...response.data].sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    },
  });
};

export default useGetPostList;
