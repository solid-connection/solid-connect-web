import { axiosInstance } from "@/utils/axiosInstance";

export type SignOutResponse = Record<string, never>;

export type SignOutRequest = Record<string, never>;

export interface AppleAuthResponse {
  isRegistered: boolean;
  nickname: null;
  email: string;
  profileImageUrl: null;
  signUpToken: string;
}

export type AppleAuthRequest = Record<string, never>;

export interface RefreshTokenResponse {
  accessToken: string;
}

export type RefreshTokenRequest = Record<string, never>;

export interface EmailLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export type EmailLoginRequest = Record<string, never>;

export interface EmailVerificationResponse {
  signUpToken: string;
}

export type EmailVerificationRequest = Record<string, never>;

export interface KakaoAuthResponse {
  isRegistered: boolean;
  nickname: string;
  email: string;
  profileImageUrl: string;
  signUpToken: string;
}

export type KakaoAuthRequest = Record<string, never>;

export type AccountResponse = void;

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
}

export type SignUpRequest = Record<string, never>;

export const authApi = {
  postSignOut: async (params: { data?: SignOutRequest }): Promise<SignOutResponse> => {
    const res = await axiosInstance.post<SignOutResponse>(
      `/auth/sign-out`, params?.data
    );
    return res.data;
  },

  postAppleAuth: async (params: { data?: AppleAuthRequest }): Promise<AppleAuthResponse> => {
    const res = await axiosInstance.post<AppleAuthResponse>(
      `/auth/apple`, params?.data
    );
    return res.data;
  },

  postRefreshToken: async (params: { data?: RefreshTokenRequest }): Promise<RefreshTokenResponse> => {
    const res = await axiosInstance.post<RefreshTokenResponse>(
      `/auth/reissue`, params?.data
    );
    return res.data;
  },

  postEmailLogin: async (params: { data?: EmailLoginRequest }): Promise<EmailLoginResponse> => {
    const res = await axiosInstance.post<EmailLoginResponse>(
      `/auth/email/sign-in`, params?.data
    );
    return res.data;
  },

  postEmailVerification: async (params: { data?: EmailVerificationRequest }): Promise<EmailVerificationResponse> => {
    const res = await axiosInstance.post<EmailVerificationResponse>(
      `/auth/email/sign-up`, params?.data
    );
    return res.data;
  },

  postKakaoAuth: async (params: { data?: KakaoAuthRequest }): Promise<KakaoAuthResponse> => {
    const res = await axiosInstance.post<KakaoAuthResponse>(
      `/auth/kakao`, params?.data
    );
    return res.data;
  },

  deleteAccount: async (): Promise<AccountResponse> => {
    const res = await axiosInstance.delete<AccountResponse>(
      `/auth/quit`
    );
    return res.data;
  },

  postSignUp: async (params: { data?: SignUpRequest }): Promise<SignUpResponse> => {
    const res = await axiosInstance.post<SignUpResponse>(
      `/auth/sign-up`, params?.data
    );
    return res.data;
  },

};