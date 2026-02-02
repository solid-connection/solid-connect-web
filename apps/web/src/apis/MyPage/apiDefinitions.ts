import type { InterestedRegionCountryRequest, InterestedRegionCountryResponse, PasswordRequest, PasswordResponse, ProfileRequest, ProfileResponse } from './api';

export const myPageApiDefinitions = {
  patchInterestedRegionCountry: {
    method: 'PATCH' as const,
    path: '{{URL}}/my/interested-location' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as InterestedRegionCountryRequest,
    response: {} as InterestedRegionCountryResponse,
  },
  patchProfile: {
    method: 'PATCH' as const,
    path: '{{URL}}/my' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as ProfileRequest,
    response: {} as ProfileResponse,
  },
  getProfile: {
    method: 'GET' as const,
    path: '{{URL}}/my' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as ProfileResponse,
  },
  patchPassword: {
    method: 'PATCH' as const,
    path: '{{URL}}/my/password' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as PasswordRequest,
    response: {} as PasswordResponse,
  },
} as const;

export type MyPageApiDefinitions = typeof myPageApiDefinitions;