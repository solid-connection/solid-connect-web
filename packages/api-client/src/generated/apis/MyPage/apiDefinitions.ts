import type { GetProfileResponse, PatchInterestedRegionCountryRequest, PatchInterestedRegionCountryResponse, PatchPasswordRequest, PatchPasswordResponse, PatchProfileRequest, PatchProfileResponse } from './api';

export const myPageApiDefinitions = {
  patchInterestedRegionCountry: {
    method: 'PATCH' as const,
    path: '/my/interested-location' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PatchInterestedRegionCountryRequest,
    response: undefined as unknown as PatchInterestedRegionCountryResponse,
  },
  patchProfile: {
    method: 'PATCH' as const,
    path: '/my' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PatchProfileRequest,
    response: undefined as unknown as PatchProfileResponse,
  },
  getProfile: {
    method: 'GET' as const,
    path: '/my' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetProfileResponse,
  },
  patchPassword: {
    method: 'PATCH' as const,
    path: '/my/password' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PatchPasswordRequest,
    response: undefined as unknown as PatchPasswordResponse,
  },
} as const;

export type MyPageApiDefinitions = typeof myPageApiDefinitions;