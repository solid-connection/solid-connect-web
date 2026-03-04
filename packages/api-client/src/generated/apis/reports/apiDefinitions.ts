import type { PostReportRequest, PostReportResponse } from './api';

export const reportsApiDefinitions = {
  postReport: {
    method: 'POST' as const,
    path: '/reports' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostReportRequest,
    response: undefined as unknown as PostReportResponse,
  },
} as const;

export type ReportsApiDefinitions = typeof reportsApiDefinitions;