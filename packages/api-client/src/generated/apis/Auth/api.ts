import { axiosInstance } from "../../../runtime/axiosInstance";

export type PostSignOutResponse = Record<string, never>;

export type PostSignOutRequest = Record<string, never>;

export interface PostAppleAuthResponse {
  isRegistered: boolean;
  nickname: null;
  email: string;
  profileImageUrl: null;
  signUpToken: string;
}

export type PostAppleAuthRequest = Record<string, never>;

export interface PostRefreshTokenResponse {
  accessToken: string;
}

export type PostRefreshTokenRequest = Record<string, never>;

export interface PostEmailLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export type PostEmailLoginRequest = Record<string, never>;

export interface PostEmailVerificationResponse {
  signUpToken: string;
}

export type PostEmailVerificationRequest = Record<string, never>;

export interface PostKakaoAuthResponse {
  isRegistered: boolean;
  nickname: string;
  email: string;
  profileImageUrl: string;
  signUpToken: string;
}

export type PostKakaoAuthRequest = Record<string, never>;

export type DeleteAccountResponse = void;

export interface PostSignUpResponse {
  accessToken: string;
  refreshToken: string;
}

export type PostSignUpRequest = Record<string, never>;

export const authApi = {
  postSignOut: async (params: { data?: PostSignOutRequest }): Promise<PostSignOutResponse> => {
    const res = await axiosInstance.post<PostSignOutResponse>(
      `/auth/sign-out`, params?.data
    );
    return res.data;
  },

  postAppleAuth: async (params: { data?: PostAppleAuthRequest }): Promise<PostAppleAuthResponse> => {
    const res = await axiosInstance.post<PostAppleAuthResponse>(
      `/auth/apple`, params?.data
    );
    return res.data;
  },

  postRefreshToken: async (params: { data?: PostRefreshTokenRequest }): Promise<PostRefreshTokenResponse> => {
    const res = await axiosInstance.post<PostRefreshTokenResponse>(
      `/auth/reissue`, params?.data
    );
    return res.data;
  },

  postEmailLogin: async (params: { data?: PostEmailLoginRequest }): Promise<PostEmailLoginResponse> => {
    const res = await axiosInstance.post<PostEmailLoginResponse>(
      `/auth/email/sign-in`, params?.data
    );
    return res.data;
  },

  postEmailVerification: async (params: { data?: PostEmailVerificationRequest }): Promise<PostEmailVerificationResponse> => {
    const res = await axiosInstance.post<PostEmailVerificationResponse>(
      `/auth/email/sign-up`, params?.data
    );
    return res.data;
  },

  postKakaoAuth: async (params: { data?: PostKakaoAuthRequest }): Promise<PostKakaoAuthResponse> => {
    const res = await axiosInstance.post<PostKakaoAuthResponse>(
      `/auth/kakao`, params?.data
    );
    return res.data;
  },

  deleteAccount: async (): Promise<DeleteAccountResponse> => {
    const res = await axiosInstance.delete<DeleteAccountResponse>(
      `/auth/quit`
    );
    return res.data;
  },

  postSignUp: async (params: { data?: PostSignUpRequest }): Promise<PostSignUpResponse> => {
    const res = await axiosInstance.post<PostSignUpResponse>(
      `/auth/sign-up`, params?.data
    );
    return res.data;
  },

};