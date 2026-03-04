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

export type DeleteAccountRequest = Record<string, never>;

export interface PostSignUpResponse {
  accessToken: string;
  refreshToken: string;
}

export type PostSignUpRequest = Record<string, never>;

export const authApi = {
  postSignOut: async (params: { data?: PostSignOutRequest }): Promise<PostSignOutResponse> => {
    const res = await axiosInstance.request<PostSignOutResponse>({
      url: `/auth/sign-out`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  postAppleAuth: async (params: { data?: PostAppleAuthRequest }): Promise<PostAppleAuthResponse> => {
    const res = await axiosInstance.request<PostAppleAuthResponse>({
      url: `/auth/apple`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  postRefreshToken: async (params: { data?: PostRefreshTokenRequest }): Promise<PostRefreshTokenResponse> => {
    const res = await axiosInstance.request<PostRefreshTokenResponse>({
      url: `/auth/reissue`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  postEmailLogin: async (params: { data?: PostEmailLoginRequest }): Promise<PostEmailLoginResponse> => {
    const res = await axiosInstance.request<PostEmailLoginResponse>({
      url: `/auth/email/sign-in`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  postEmailVerification: async (params: { data?: PostEmailVerificationRequest }): Promise<PostEmailVerificationResponse> => {
    const res = await axiosInstance.request<PostEmailVerificationResponse>({
      url: `/auth/email/sign-up`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  postKakaoAuth: async (params: { data?: PostKakaoAuthRequest }): Promise<PostKakaoAuthResponse> => {
    const res = await axiosInstance.request<PostKakaoAuthResponse>({
      url: `/auth/kakao`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  deleteAccount: async (params: { data?: DeleteAccountRequest }): Promise<DeleteAccountResponse> => {
    const res = await axiosInstance.request<DeleteAccountResponse>({
      url: `/auth/quit`,
      method: "DELETE",
      data: params?.data,
    });
    return res.data;
  },

  postSignUp: async (params: { data?: PostSignUpRequest }): Promise<PostSignUpResponse> => {
    const res = await axiosInstance.request<PostSignUpResponse>({
      url: `/auth/sign-up`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

};