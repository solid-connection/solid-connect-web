import { useEffect, useState } from "react";

import useFetch from "@/utils/apiUtils";

import { ArticleResponse } from "../type/response";

/* ---------- 타입 ---------- */

interface ArticleListResponse {
  news: ArticleResponse[]; // 최대 5개
}

const useGetArticleList = (userId: number | null) => {
  const { result, loading, error, fetchData } = useFetch<ArticleListResponse>();

  const [articleList, setArticleList] = useState<ArticleResponse[]>([]);

  /* 페이지 변경 시 데이터 요청 */
  useEffect(() => {
    if (userId === null) return;

    fetchData({
      method: "get",
      url: `/news?site-user-id=${userId}`,
      body: undefined,
      isToken: true,
    });
  }, [userId, fetchData]);

  /* 응답 처리 */
  useEffect(() => {
    if (result) {
      setArticleList(result.data.news);
    }
  }, [result]);

  return { articleList, loading, error };
};

export default useGetArticleList;
