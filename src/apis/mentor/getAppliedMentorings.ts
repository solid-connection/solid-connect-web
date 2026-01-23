import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  type ApplyMentoringListResponse,
  type MentoringListItem,
  MentorQueryKeys,
  mentorApi,
  type VerifyStatus,
} from "./api";

/**
 * @description 신청한 멘토링 목록 조회 훅 (무한 스크롤)
 */
const useGetApplyMentoringList = (verifyStatus: VerifyStatus) => {
  return useInfiniteQuery<ApplyMentoringListResponse, AxiosError, MentoringListItem[], [string, VerifyStatus], number>({
    queryKey: [MentorQueryKeys.applyMentoringList, verifyStatus],
    queryFn: ({ pageParam = 0 }) => mentorApi.getApplyMentoringList(verifyStatus, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.nextPageNumber === -1 ? undefined : lastPage.nextPageNumber),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (data) => data.pages.flatMap((p) => p.content),
  });
};

// 멘토링 리스트 프리페치용 훅
export const usePrefetchApplyMentoringList = () => {
  const queryClient = useQueryClient();

  const prefetchList = (verifyStatus: VerifyStatus) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: [MentorQueryKeys.applyMentoringList, verifyStatus],
      queryFn: ({ pageParam = 0 }) => mentorApi.getApplyMentoringList(verifyStatus, pageParam as number),
      initialPageParam: 0,
      staleTime: 1000 * 60 * 5,
    });
  };

  return { prefetchList };
};

export default useGetApplyMentoringList;
