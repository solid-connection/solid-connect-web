import type { AddWishResponse, ByRegionCountryResponse, IsWishResponse, RecommendedUniversitiesResponse, SearchFilterResponse, SearchTextResponse, UniversityDetailResponse, WishListResponse, WishResponse } from './api';

export const universitiesApiDefinitions = {
  getRecommendedUniversities: {
    method: 'GET' as const,
    path: '{{URL}}/univ-apply-infos/recommend' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as RecommendedUniversitiesResponse,
  },
  getWishList: {
    method: 'GET' as const,
    path: '{{URL}}/univ-apply-infos/like' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as WishListResponse,
  },
  deleteWish: {
    method: 'DELETE' as const,
    path: '{{URL}}/univ-apply-infos/{{univ-apply-info-id}}/like' as const,
    pathParams: {} as { univApplyInfoId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as WishResponse,
  },
  postAddWish: {
    method: 'POST' as const,
    path: '{{URL}}/univ-apply-infos/{{univ-apply-info-id}}/like' as const,
    pathParams: {} as { univApplyInfoId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as AddWishResponse,
  },
  getIsWish: {
    method: 'GET' as const,
    path: '{{URL}}/univ-apply-infos/{{univ-apply-info-id}}/like' as const,
    pathParams: {} as { univApplyInfoId: string | number },
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as IsWishResponse,
  },
  getUniversityDetail: {
    method: 'GET' as const,
    path: '{{URL}}/univ-apply-infos/{{univ-apply-info-id}}' as const,
    pathParams: {} as { univApplyInfoId: string | number },
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as UniversityDetailResponse,
  },
  getSearchText: {
    method: 'GET' as const,
    path: '{{URL}}/univ-apply-infos/search/text?value=괌' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as SearchTextResponse,
  },
  getSearchFilter: {
    method: 'GET' as const,
    path: '{{URL}}/univ-apply-infos/search/filter' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as SearchFilterResponse,
  },
  getByRegionCountry: {
    method: 'GET' as const,
    path: '{{URL}}/universities/search' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as ByRegionCountryResponse,
  },
} as const;

export type UniversitiesApiDefinitions = typeof universitiesApiDefinitions;