import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type MentorCardDetail, type MentorListResponse, MentorQueryKeys, mentorApi } from "./api";

interface UseGetMentorListRequest {
  region?: string;
}

/**
 * @description 멘토 목록 조회 훅 (무한 스크롤)
 */
const useGetMentorList = ({ region = "" }: UseGetMentorListRequest = {}) => {
  return useInfiniteQuery<MentorListResponse, AxiosError, MentorCardDetail[], [string, string], number>({
    queryKey: [MentorQueryKeys.mentorList, region],
    queryFn: ({ pageParam = 0 }) => mentorApi.getMentorList(region, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.nextPageNumber === -1 ? undefined : lastPage.nextPageNumber),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.pages.flatMap((p) => p.content),
  });
};

// 탭 프리페치용 훅
export const usePrefetchMentorList = () => {
  const queryClient = useQueryClient();

  const prefetchMentorList = (region: string) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: [MentorQueryKeys.mentorList, region],
      queryFn: ({ pageParam = 0 }) => mentorApi.getMentorList(region, pageParam as number),
      initialPageParam: 0,
      staleTime: 1000 * 60 * 5,
    });
  };

  return { prefetchMentorList };
};

export default useGetMentorList;
