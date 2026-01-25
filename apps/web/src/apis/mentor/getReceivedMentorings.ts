import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type MentoringItem, type MentoringListResponse, MentorQueryKeys, mentorApi } from "./api";

const OFFSET = 5;

/**
 * @description 받은 멘토링 목록 조회 훅 (무한 스크롤)
 */
const useGetMentoringList = ({ size = OFFSET }: { size?: number } = {}) => {
  return useInfiniteQuery<MentoringListResponse, AxiosError, MentoringItem[], [string, number], number>({
    queryKey: [MentorQueryKeys.mentoringList, size],
    queryFn: ({ pageParam = 0 }) => mentorApi.getMentoringList(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageNumber !== -1 ? lastPage.nextPageNumber : undefined;
    },
    refetchInterval: 1000 * 60 * 10, // ⏱️ 10분마다 자동 재요청
    staleTime: 1000 * 60 * 5, // fresh 상태 유지
    select: (data) => data.pages.flatMap((page) => page.content),
  });
};

export default useGetMentoringList;
