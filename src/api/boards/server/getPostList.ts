import serverFetch, { ServerFetchResult } from "@/utils/serverFetchUtil";

import { ListPost } from "@/types/community";

interface GetPostListParams {
  boardCode: string;
  category?: string | null;
  revalidate?: number | false;
}

/**
 * @description 게시글 목록을 서버에서 가져오는 함수 (ISR 지원)
 * @param boardCode - 게시판 코드
 * @param category - 카테고리 (선택)
 * @param revalidate - ISR revalidate 시간(초) 또는 false (무한 캐시)
 * @returns Promise<ServerFetchResult<ListPost[]>>
 */
export const getPostList = async ({
  boardCode,
  category = null,
  revalidate = false, // 기본값: 자동 재생성 비활성화 (수동 revalidate만)
}: GetPostListParams): Promise<ServerFetchResult<ListPost[]>> => {
  const params = new URLSearchParams();
  // "전체"는 필터 없음을 의미하므로 파라미터에 포함하지 않음
  if (category && category !== "전체") {
    params.append("category", category);
  }

  const queryString = params.toString();
  const url = `/boards/${boardCode}${queryString ? `?${queryString}` : ""}`;

  return serverFetch<ListPost[]>(url, {
    method: "GET",
    next: {
      revalidate,
      tags: [`posts-${boardCode}`], // 태그 기반 revalidation 지원 (글 작성 시만 revalidate)
    },
  });
};
