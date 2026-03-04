import type { GetKakaoInfoResponse, GetKakaoUserIdsResponse, PostKakaoUnlinkResponse } from './api';

export const kakaoApiApiDefinitions = {
  getKakaoUserIds: {
    method: 'GET' as const,
    path: 'https://kapi.kakao.com/v1/user/ids' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetKakaoUserIdsResponse,
  },
  postKakaoUnlink: {
    method: 'POST' as const,
    path: 'https://kapi.kakao.com/v1/user/unlink' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostKakaoUnlinkResponse,
  },
  getKakaoInfo: {
    method: 'GET' as const,
    path: 'https://kapi.kakao.com/v2/user/me' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetKakaoInfoResponse,
  },
} as const;

export type KakaoApiApiDefinitions = typeof kakaoApiApiDefinitions;