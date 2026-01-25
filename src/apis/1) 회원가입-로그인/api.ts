import { axiosInstance } from "@/utils/axiosInstance";

export type 로그아웃Response = void;

export type 로그아웃Request = Record<string, never>;

export interface 애플 인증 (로그인 or 가입 코드 발급)Response {
  isRegistered: boolean;
  nickname: null;
  email: string;
  profileImageUrl: null;
  signUpToken: string;
}

export type 애플 인증 (로그인 or 가입 코드 발급)Request = Record<string, never>;

export interface 엑세스 토큰 재발급Response {
  accessToken: string;
}

export type 엑세스 토큰 재발급Request = Record<string, never>;

export interface 이메일 로그인Response {
  accessToken: string;
  refreshToken: string;
}

export type 이메일 로그인Request = Record<string, never>;

export interface 이메일 인증 (가입 코드 발급)Response {
  signUpToken: string;
}

export type 이메일 인증 (가입 코드 발급)Request = Record<string, never>;

export interface 카카오 인증 (로그인 or 가입 코드 발급)Response {
  isRegistered: boolean;
  nickname: string;
  email: string;
  profileImageUrl: string;
  signUpToken: string;
}

export type 카카오 인증 (로그인 or 가입 코드 발급)Request = Record<string, never>;

export type 회원 탈퇴Response = void;

export interface 회원가입Response {
  accessToken: string;
  refreshToken: string;
}

export type 회원가입Request = Record<string, never>;

export const 1) 회원가입로그인Api = {
  post로그아웃: async (params: { data?: 로그아웃Request }): Promise<로그아웃Response> => {
    const res = await axiosInstance.post<로그아웃Response>(
      `/auth/sign-out`, params?.data
    );
    return res.data;
  },

  post애플 인증 (로그인 or 가입 코드 발급): async (params: { data?: 애플 인증 (로그인 or 가입 코드 발급)Request }): Promise<애플 인증 (로그인 or 가입 코드 발급)Response> => {
    const res = await axiosInstance.post<애플 인증 (로그인 or 가입 코드 발급)Response>(
      `/auth/apple`, params?.data
    );
    return res.data;
  },

  post엑세스 토큰 재발급: async (params: { data?: 엑세스 토큰 재발급Request }): Promise<엑세스 토큰 재발급Response> => {
    const res = await axiosInstance.post<엑세스 토큰 재발급Response>(
      `/auth/reissue`, params?.data
    );
    return res.data;
  },

  post이메일 로그인: async (params: { data?: 이메일 로그인Request }): Promise<이메일 로그인Response> => {
    const res = await axiosInstance.post<이메일 로그인Response>(
      `/auth/email/sign-in`, params?.data
    );
    return res.data;
  },

  post이메일 인증 (가입 코드 발급): async (params: { data?: 이메일 인증 (가입 코드 발급)Request }): Promise<이메일 인증 (가입 코드 발급)Response> => {
    const res = await axiosInstance.post<이메일 인증 (가입 코드 발급)Response>(
      `/auth/email/sign-up`, params?.data
    );
    return res.data;
  },

  post카카오 인증 (로그인 or 가입 코드 발급): async (params: { data?: 카카오 인증 (로그인 or 가입 코드 발급)Request }): Promise<카카오 인증 (로그인 or 가입 코드 발급)Response> => {
    const res = await axiosInstance.post<카카오 인증 (로그인 or 가입 코드 발급)Response>(
      `/auth/kakao`, params?.data
    );
    return res.data;
  },

  delete회원 탈퇴: async (): Promise<회원 탈퇴Response> => {
    const res = await axiosInstance.delete<회원 탈퇴Response>(
      `/auth/quit`
    );
    return res.data;
  },

  post회원가입: async (params: { data?: 회원가입Request }): Promise<회원가입Response> => {
    const res = await axiosInstance.post<회원가입Response>(
      `/auth/sign-up`, params?.data
    );
    return res.data;
  },

};