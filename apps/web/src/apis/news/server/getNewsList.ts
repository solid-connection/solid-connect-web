import type { ArticleListResponse } from "@/apis/news";
import type { News } from "@/types/news";
import serverFetch from "@/utils/serverFetchUtil";

const HOME_NEWS_AUTHOR_ID = 6;

export const getHomeNewsList = async (): Promise<News[]> => {
  const response = await serverFetch<ArticleListResponse>(`/news?author-id=${HOME_NEWS_AUTHOR_ID}`);

  if (!response.ok) {
    console.error("Failed to fetch home news list:", response.error);
    return [];
  }

  return response.data.newsResponseList
    .map((news) => ({
      id: news.id,
      title: news.title,
      description: news.description,
      imageUrl: news.thumbnailUrl,
      url: news.url,
    }))
    .sort((a, b) => a.id - b.id);
};
