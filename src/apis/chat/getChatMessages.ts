import { AxiosError } from "axios";

import { ChatHistoriesResponse, ChatMessage, ChatQueryKeys, chatApi } from "./api";

import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * @description 채팅 히스토리를 무한 스크롤로 가져오는 훅
 */
const useGetChatHistories = (roomId: number, size: number = 20) => {
  return useInfiniteQuery<
    ChatHistoriesResponse,
    AxiosError,
    {
      pages: ChatHistoriesResponse[];
      pageParams: number[];
      messages: ChatMessage[];
    },
    [string, number],
    number
  >({
    queryKey: [ChatQueryKeys.chatHistories, roomId],
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) => chatApi.getChatHistories({ roomId, size, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: ChatHistoriesResponse) => {
      // nextPageNumber가 -1이면 더 이상 페이지가 없음
      return lastPage.nextPageNumber === -1 ? undefined : lastPage.nextPageNumber;
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    enabled: !!roomId, // roomId가 있을 때만 쿼리 실행
    meta: {
      disableGlobalLoading: true, // 전역 로딩 비활성화
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      messages: data.pages.flatMap((page) => page.content),
    }),
  });
};

export default useGetChatHistories;
