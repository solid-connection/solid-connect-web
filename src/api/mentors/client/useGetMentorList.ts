import { axiosInstance } from "@/utils/axiosInstance";

import { queryKey } from "./queryKey";

import { MentorCardDetail } from "@/types/mentor";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";

interface UseGetMentorListRequest {
  region?: string;
}

interface GetMentorListResponse {
  /** 다음 페이지 번호. 다음 페이지가 없으면 -1 */
  nextPageNumber: number;
  content: MentorCardDetail[];
}

const OFFSET = 10; // 기본 페이지 크기

const getMentorList = async ({
  queryKey,
  pageParam,
}: QueryFunctionContext<[string, string], number>): Promise<GetMentorListResponse> => {
  const [, region] = queryKey;
  const res = await axiosInstance.get<GetMentorListResponse>(
    `/mentors?region=${region}&page=${pageParam}&size=${OFFSET}`,
  );
  return res.data;
};

const useGetMentorList = ({ region = "" }: UseGetMentorListRequest = {}) =>
  useInfiniteQuery<GetMentorListResponse, Error, MentorCardDetail[], [string, string], number>({
    queryKey: [queryKey.mentorList, region],
    queryFn: getMentorList,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.nextPageNumber === -1 ? undefined : lastPage.nextPageNumber),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.pages.flatMap((p) => p.content),
  });

// 탭 프리페치용 훅
export const usePrefetchMentorList = () => {
  const queryClient = useQueryClient();

  const prefetchMentorList = (region: string) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: [queryKey.mentorList, region],
      queryFn: getMentorList,
      initialPageParam: 0,
      staleTime: 1000 * 60 * 5,
    });
  };

  return { prefetchMentorList };
};

export default useGetMentorList;
