import type { KakaoInfoResponse, KakaoUnlinkResponse, KakaoUserIdsResponse } from './api';

export const kakaoApiApiDefinitions = {
  getKakaoUserIds: {
    method: 'GET' as const,
    path: 'https://kapi.kakao.com/v1/user/ids?order=dsc' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as KakaoUserIdsResponse,
  },
  postKakaoUnlink: {
    method: 'POST' as const,
    path: 'https://kapi.kakao.com/v1/user/unlink?target_id_type=user_id&target_id=3715136239' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as KakaoUnlinkResponse,
  },
  getKakaoInfo: {
    method: 'GET' as const,
    path: 'https://kapi.kakao.com/v2/user/me?property_keys=["kakao_account.email"]&target_id_type=user_id&target_id=3715136239' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as KakaoInfoResponse,
  },
} as const;

export type KakaoApiApiDefinitions = typeof kakaoApiApiDefinitions;