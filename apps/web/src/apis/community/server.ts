import type { ListPost } from "@/types/community";
import serverFetch, { type ServerFetchResult } from "@/utils/serverFetchUtil";

interface GetPostListParams {
  boardCode: string;
  category?: string | null;
}

/**
 * @description 게시글 목록을 서버에서 최신 상태로 가져오는 함수
 * @param boardCode - 게시판 코드
 * @param category - 카테고리 (선택)
 * @returns Promise<ServerFetchResult<ListPost[]>>
 */
export const getPostListServer = async ({
  boardCode,
  category = null,
}: GetPostListParams): Promise<ServerFetchResult<ListPost[]>> => {
  const params = new URLSearchParams();
  if (category && category !== "전체") {
    params.append("category", category);
  }

  const queryString = params.toString();
  const url = `/boards/${boardCode}${queryString ? `?${queryString}` : ""}`;

  return serverFetch<ListPost[]>(url, {
    method: "GET",
    cache: "no-store",
  });
};
