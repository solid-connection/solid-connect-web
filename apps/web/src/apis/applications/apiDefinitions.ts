import type { ApplicantsResponse, CompetitorsResponse, SubmitApplicationRequest, SubmitApplicationResponse } from './api';

export const applicationsApiDefinitions = {
  getCompetitors: {
    method: 'GET' as const,
    path: '{{URL}}/applications/competitors' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as CompetitorsResponse,
  },
  postSubmitApplication: {
    method: 'POST' as const,
    path: '{{URL}}/applications' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as SubmitApplicationRequest,
    response: {} as SubmitApplicationResponse,
  },
  getApplicants: {
    method: 'GET' as const,
    path: '{{URL}}/applications' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as ApplicantsResponse,
  },
} as const;

export type ApplicationsApiDefinitions = typeof applicationsApiDefinitions;