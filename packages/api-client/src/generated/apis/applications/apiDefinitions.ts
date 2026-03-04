import type { GetApplicantsResponse, GetCompetitorsResponse, PostSubmitApplicationRequest, PostSubmitApplicationResponse } from './api';

export const applicationsApiDefinitions = {
  getCompetitors: {
    method: 'GET' as const,
    path: '/applications/competitors' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetCompetitorsResponse,
  },
  postSubmitApplication: {
    method: 'POST' as const,
    path: '/applications' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostSubmitApplicationRequest,
    response: undefined as unknown as PostSubmitApplicationResponse,
  },
  getApplicants: {
    method: 'GET' as const,
    path: '/applications' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetApplicantsResponse,
  },
} as const;

export type ApplicationsApiDefinitions = typeof applicationsApiDefinitions;