import type { CreateGpaResponse, CreateLanguageTestResponse, GpaListResponse, LanguageTestListResponse } from './api';

export const scoresApiDefinitions = {
  postCreateLanguageTest: {
    method: 'POST' as const,
    path: '{{URL}}/scores/language-tests' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as CreateLanguageTestResponse,
  },
  getLanguageTestList: {
    method: 'GET' as const,
    path: '{{URL}}/scores/language-tests' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as LanguageTestListResponse,
  },
  postCreateGpa: {
    method: 'POST' as const,
    path: '{{URL}}/scores/gpas' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as CreateGpaResponse,
  },
  getGpaList: {
    method: 'GET' as const,
    path: '{{URL}}/scores/gpas' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as GpaListResponse,
  },
} as const;

export type ScoresApiDefinitions = typeof scoresApiDefinitions;