import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { MentoringItem } from "@/types/mentor";

import { useInfiniteQuery } from "@tanstack/react-query";

interface UseGetMentoringListResponse {
  content: MentoringItem[];
  nextPageNumber: number;
}
interface UseGetMentoringListRequest {
  size?: number;
}
const OFFSET = 5; // 페이지 오프셋 초기값

const getMentoringList = async (page: number, size: number = OFFSET): Promise<UseGetMentoringListResponse> => {
  const endpoint = `/mentor/mentorings?size=${size}&page=${page}`;
  const res = await axiosInstance.get<UseGetMentoringListResponse>(endpoint);
  return res.data;
};

// 무한스크롤을 위한 useInfiniteQuery
const useGetMentoringList = ({ size = OFFSET }: UseGetMentoringListRequest) =>
  useInfiniteQuery<UseGetMentoringListResponse, Error, MentoringItem[], [QueryKeys, number], number>({
    queryKey: [QueryKeys.mentoringList, size],
    queryFn: ({ pageParam = 0 }) => getMentoringList(pageParam as number, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage: UseGetMentoringListResponse) => {
      // nextPageNumber가 -1이면 더 이상 페이지가 없음
      return lastPage.nextPageNumber !== -1 ? lastPage.nextPageNumber : undefined;
    },
    refetchInterval: 1000 * 60 * 10, // ⏱️ 10분마다 자동 재요청
    refetchOnWindowFocus: true, // 탭 돌아올 때도 최신화
    staleTime: 1000 * 60 * 5, // fresh 상태 유지
    select: (data) => data.pages.flatMap((page) => page.content), // 모든 페이지의 content를 평
    // select: (data) => data.pages.flatMap((p) => p.content),
  });

export default useGetMentoringList;
