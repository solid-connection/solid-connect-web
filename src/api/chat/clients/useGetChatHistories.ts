import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { ChatMessage } from "@/types/chat";

import { useInfiniteQuery } from "@tanstack/react-query";

export interface ChatHistoriesResponse {
  nextPageNumber: number; // 다음 페이지가 없다면 -1
  content: ChatMessage[];
}

interface GetChatHistoriesParams {
  roomId: number;
  size?: number;
  page?: number;
}

const getChatHistories = async ({
  roomId,
  size = 20,
  page = 0,
}: GetChatHistoriesParams): Promise<ChatHistoriesResponse> => {
  const res = await axiosInstance.get<ChatHistoriesResponse>(`/chats/rooms/${roomId}`, {
    params: {
      size,
      page,
    },
  });
  return res.data;
};

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
    queryKey: [QueryKeys.chatHistories, roomId],
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) => getChatHistories({ roomId, size, page: pageParam }),
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
      // 모든 페이지의 메시지를 하나의 배열로 합침
      messages: data.pages.flatMap((page: ChatHistoriesResponse) => page.content),
    }),
  });
};

export default useGetChatHistories;
