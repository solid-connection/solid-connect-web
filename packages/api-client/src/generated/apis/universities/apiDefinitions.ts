import type { DeleteWishResponse, GetByRegionCountryResponse, GetIsWishResponse, GetRecommendedUniversitiesResponse, GetSearchTextResponse, GetUniversityDetailResponse, GetWishListResponse, PostAddWishResponse } from './api';

export const universitiesApiDefinitions = {
  getRecommendedUniversities: {
    method: 'GET' as const,
    path: '/univ-apply-infos/recommend' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetRecommendedUniversitiesResponse,
  },
  getWishList: {
    method: 'GET' as const,
    path: '/univ-apply-infos/like' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetWishListResponse,
  },
  deleteWish: {
    method: 'DELETE' as const,
    path: '/univ-apply-infos/{{univ-apply-info-id}}/like' as const,
    pathParams: undefined as unknown as { univApplyInfoId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as DeleteWishResponse,
  },
  postAddWish: {
    method: 'POST' as const,
    path: '/univ-apply-infos/{{univ-apply-info-id}}/like' as const,
    pathParams: undefined as unknown as { univApplyInfoId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostAddWishResponse,
  },
  getIsWish: {
    method: 'GET' as const,
    path: '/univ-apply-infos/{{univ-apply-info-id}}/like' as const,
    pathParams: undefined as unknown as { univApplyInfoId: string | number },
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetIsWishResponse,
  },
  getUniversityDetail: {
    method: 'GET' as const,
    path: '/univ-apply-infos/{{univ-apply-info-id}}' as const,
    pathParams: undefined as unknown as { univApplyInfoId: string | number },
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetUniversityDetailResponse,
  },
  getSearchText: {
    method: 'GET' as const,
    path: '/univ-apply-infos/search/text' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetSearchTextResponse,
  },
  getByRegionCountry: {
    method: 'GET' as const,
    path: '/universities/search' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetByRegionCountryResponse,
  },
} as const;

export type UniversitiesApiDefinitions = typeof universitiesApiDefinitions;