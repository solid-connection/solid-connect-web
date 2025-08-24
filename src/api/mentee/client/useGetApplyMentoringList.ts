import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { MentoringListItem } from "@/types/mentee";
import { VerifyStatus } from "@/types/mentee";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";

interface UseGetApplyMentoringListResponse {
  content: MentoringListItem[];
  nextPageNumber: number;
}
type UseGetApplyMentoringListRequest = VerifyStatus;

const OFFSET = 3; // 기본 페이지 크기

const getApplyMentoringList = async ({
  queryKey,
  pageParam,
}: QueryFunctionContext<[string, VerifyStatus], number>): Promise<UseGetApplyMentoringListResponse> => {
  const [, verifyStatus] = queryKey;
  const res = await axiosInstance.get<UseGetApplyMentoringListResponse>(
    `/mentee/mentorings?verify-status=${verifyStatus}&size=${OFFSET}&page=${pageParam}`,
  );
  return res.data;
};

const useGetApplyMentoringList = (verifyStatus: UseGetApplyMentoringListRequest) => {
  return useInfiniteQuery<
    UseGetApplyMentoringListResponse,
    AxiosError,
    MentoringListItem[],
    [string, VerifyStatus],
    number
  >({
    queryKey: [QueryKeys.applyMentoringList, verifyStatus],
    queryFn: getApplyMentoringList,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.nextPageNumber === -1 ? undefined : lastPage.nextPageNumber),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (data) => data.pages.flatMap((p) => p.content),
  });
};

// 멘토링 리스트 프리페치용 훅
export const usePrefetchApplyMentoringList = () => {
  const queryClient = useQueryClient();

  const prefetchMenteeMentoringList = (verifyStatus: UseGetApplyMentoringListRequest) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: [QueryKeys.applyMentoringList, verifyStatus],
      queryFn: getApplyMentoringList,
      initialPageParam: 0,
      staleTime: 1000 * 60 * 5,
    });
  };

  return { prefetchMenteeMentoringList };
};

export default useGetApplyMentoringList;
