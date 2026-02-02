import type { GpaListResponse, LanguageTestListResponse, VerifyGpaRequest, VerifyGpaResponse, VerifyLanguageTestRequest, VerifyLanguageTestResponse } from './api';

export const adminApiDefinitions = {
  putVerifyLanguageTest: {
    method: 'PUT' as const,
    path: '{{URL}}/admin/scores/language-tests/{{language-test-score-id}}' as const,
    pathParams: {} as { languageTestScoreId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as VerifyLanguageTestRequest,
    response: {} as VerifyLanguageTestResponse,
  },
  getLanguageTestList: {
    method: 'GET' as const,
    path: '{{URL}}/admin/scores/language-tests?page=1&size=10' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as LanguageTestListResponse,
  },
  putVerifyGpa: {
    method: 'PUT' as const,
    path: '{{URL}}/admin/scores/gpas/{{gpa-score-id}}' as const,
    pathParams: {} as { gpaScoreId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as VerifyGpaRequest,
    response: {} as VerifyGpaResponse,
  },
  getGpaList: {
    method: 'GET' as const,
    path: '{{URL}}/admin/scores/gpas' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as GpaListResponse,
  },
} as const;

export type AdminApiDefinitions = typeof adminApiDefinitions;