import type { CreateNewsRequest, CreateNewsResponse, LikeNewsResponse, NewsListResponse, NewsResponse, UpdateNewsRequest, UpdateNewsResponse } from './api';

export const newsApiDefinitions = {
  getNewsList: {
    method: 'GET' as const,
    path: '{{URL}}/news?author-id=6' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as NewsListResponse,
  },
  deleteNews: {
    method: 'DELETE' as const,
    path: '{{URL}}/news/{{news-id}}' as const,
    pathParams: {} as { newsId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as NewsResponse,
  },
  putUpdateNews: {
    method: 'PUT' as const,
    path: '{{URL}}/news/{{news-id}}' as const,
    pathParams: {} as { newsId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as UpdateNewsRequest,
    response: {} as UpdateNewsResponse,
  },
  postLikeNews: {
    method: 'POST' as const,
    path: '{{URL}}/news/{{news-id}}/like' as const,
    pathParams: {} as { newsId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as LikeNewsResponse,
  },
  deleteLikeNews: {
    method: 'DELETE' as const,
    path: '{{URL}}/news/{{news-id}}/like' as const,
    pathParams: {} as { newsId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as LikeNewsResponse,
  },
  postCreateNews: {
    method: 'POST' as const,
    path: '{{URL}}/news' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as CreateNewsRequest,
    response: {} as CreateNewsResponse,
  },
} as const;

export type NewsApiDefinitions = typeof newsApiDefinitions;