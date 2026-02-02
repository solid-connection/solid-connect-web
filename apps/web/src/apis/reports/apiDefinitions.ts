import type { ReportRequest, ReportResponse } from './api';

export const reportsApiDefinitions = {
  postReport: {
    method: 'POST' as const,
    path: '{{URL}}/reports' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as ReportRequest,
    response: {} as ReportResponse,
  },
} as const;

export type ReportsApiDefinitions = typeof reportsApiDefinitions;