import type { DeleteLikeNewsResponse, DeleteNewsResponse, GetNewsListResponse, PostCreateNewsRequest, PostCreateNewsResponse, PostLikeNewsResponse, PutUpdateNewsRequest, PutUpdateNewsResponse } from './api';

export const newsApiDefinitions = {
  getNewsList: {
    method: 'GET' as const,
    path: '/news' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetNewsListResponse,
  },
  deleteNews: {
    method: 'DELETE' as const,
    path: '/news/{{news-id}}' as const,
    pathParams: undefined as unknown as { newsId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as DeleteNewsResponse,
  },
  putUpdateNews: {
    method: 'PUT' as const,
    path: '/news/{{news-id}}' as const,
    pathParams: undefined as unknown as { newsId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PutUpdateNewsRequest,
    response: undefined as unknown as PutUpdateNewsResponse,
  },
  postLikeNews: {
    method: 'POST' as const,
    path: '/news/{{news-id}}/like' as const,
    pathParams: undefined as unknown as { newsId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostLikeNewsResponse,
  },
  deleteLikeNews: {
    method: 'DELETE' as const,
    path: '/news/{{news-id}}/like' as const,
    pathParams: undefined as unknown as { newsId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as DeleteLikeNewsResponse,
  },
  postCreateNews: {
    method: 'POST' as const,
    path: '/news' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostCreateNewsRequest,
    response: undefined as unknown as PostCreateNewsResponse,
  },
} as const;

export type NewsApiDefinitions = typeof newsApiDefinitions;