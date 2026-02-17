import type { GetGpaListResponse, GetLanguageTestListResponse, PostCreateGpaResponse, PostCreateLanguageTestResponse } from './api';

export const scoresApiDefinitions = {
  postCreateLanguageTest: {
    method: 'POST' as const,
    path: '/scores/language-tests' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostCreateLanguageTestResponse,
  },
  getLanguageTestList: {
    method: 'GET' as const,
    path: '/scores/language-tests' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetLanguageTestListResponse,
  },
  postCreateGpa: {
    method: 'POST' as const,
    path: '/scores/gpas' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostCreateGpaResponse,
  },
  getGpaList: {
    method: 'GET' as const,
    path: '/scores/gpas' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetGpaListResponse,
  },
} as const;

export type ScoresApiDefinitions = typeof scoresApiDefinitions;