import type { DeleteAccountResponse, PostAppleAuthRequest, PostAppleAuthResponse, PostEmailLoginRequest, PostEmailLoginResponse, PostEmailVerificationRequest, PostEmailVerificationResponse, PostKakaoAuthRequest, PostKakaoAuthResponse, PostRefreshTokenResponse, PostSignOutResponse, PostSignUpRequest, PostSignUpResponse } from './api';

export const authApiDefinitions = {
  postSignOut: {
    method: 'POST' as const,
    path: '/auth/sign-out' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostSignOutResponse,
  },
  postAppleAuth: {
    method: 'POST' as const,
    path: '/auth/apple' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostAppleAuthRequest,
    response: undefined as unknown as PostAppleAuthResponse,
  },
  postRefreshToken: {
    method: 'POST' as const,
    path: '/auth/reissue' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostRefreshTokenResponse,
  },
  postEmailLogin: {
    method: 'POST' as const,
    path: '/auth/email/sign-in' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostEmailLoginRequest,
    response: undefined as unknown as PostEmailLoginResponse,
  },
  postEmailVerification: {
    method: 'POST' as const,
    path: '/auth/email/sign-up' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostEmailVerificationRequest,
    response: undefined as unknown as PostEmailVerificationResponse,
  },
  postKakaoAuth: {
    method: 'POST' as const,
    path: '/auth/kakao' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostKakaoAuthRequest,
    response: undefined as unknown as PostKakaoAuthResponse,
  },
  deleteAccount: {
    method: 'DELETE' as const,
    path: '/auth/quit' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as DeleteAccountResponse,
  },
  postSignUp: {
    method: 'POST' as const,
    path: '/auth/sign-up' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostSignUpRequest,
    response: undefined as unknown as PostSignUpResponse,
  },
} as const;

export type AuthApiDefinitions = typeof authApiDefinitions;