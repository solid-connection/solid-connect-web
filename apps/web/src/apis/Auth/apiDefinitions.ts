import type { AccountResponse, AppleAuthRequest, AppleAuthResponse, EmailLoginRequest, EmailLoginResponse, EmailVerificationRequest, EmailVerificationResponse, KakaoAuthRequest, KakaoAuthResponse, RefreshTokenResponse, SignOutResponse, SignUpRequest, SignUpResponse } from './api';

export const authApiDefinitions = {
  postSignOut: {
    method: 'POST' as const,
    path: '{{URL}}/auth/sign-out' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as SignOutResponse,
  },
  postAppleAuth: {
    method: 'POST' as const,
    path: '{{URL}}/auth/apple' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as AppleAuthRequest,
    response: {} as AppleAuthResponse,
  },
  postRefreshToken: {
    method: 'POST' as const,
    path: '{{URL}}/auth/reissue' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as RefreshTokenResponse,
  },
  postEmailLogin: {
    method: 'POST' as const,
    path: '{{URL}}/auth/email/sign-in' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as EmailLoginRequest,
    response: {} as EmailLoginResponse,
  },
  postEmailVerification: {
    method: 'POST' as const,
    path: '{{URL}}/auth/email/sign-up' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as EmailVerificationRequest,
    response: {} as EmailVerificationResponse,
  },
  postKakaoAuth: {
    method: 'POST' as const,
    path: '{{URL}}/auth/kakao' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as KakaoAuthRequest,
    response: {} as KakaoAuthResponse,
  },
  deleteAccount: {
    method: 'DELETE' as const,
    path: '{{URL}}/auth/quit' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as AccountResponse,
  },
  postSignUp: {
    method: 'POST' as const,
    path: '{{URL}}/auth/sign-up' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as SignUpRequest,
    response: {} as SignUpResponse,
  },
} as const;

export type AuthApiDefinitions = typeof authApiDefinitions;