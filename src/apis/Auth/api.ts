import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

export type SignOutResponse = Record<string, never>;

export type SignOutRequest = Record<string, never>;

// Apple Auth Types
export interface RegisteredAppleAuthResponse {
  isRegistered: true;
  accessToken: string;
  refreshToken: string;
}

export interface UnregisteredAppleAuthResponse {
  isRegistered: false;
  nickname: null;
  email: string;
  profileImageUrl: null;
  signUpToken: string;
}

export type AppleAuthResponse = RegisteredAppleAuthResponse | UnregisteredAppleAuthResponse;

export interface AppleAuthRequest {
  code: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export type RefreshTokenRequest = Record<string, never>;

export interface EmailLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface EmailVerificationResponse {
  signUpToken: string;
}

export interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

// Kakao Auth Types
export interface RegisteredKakaoAuthResponse {
  isRegistered: true;
  accessToken: string;
  refreshToken: string;
}

export interface UnregisteredKakaoAuthResponse {
  isRegistered: false;
  nickname: string;
  email: string;
  profileImageUrl: string;
  signUpToken: string;
}

export type KakaoAuthResponse = RegisteredKakaoAuthResponse | UnregisteredKakaoAuthResponse;

export interface KakaoAuthRequest {
  code: string;
}

export type AccountResponse = void;

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpRequest {
  signUpToken: string;
  nickname: string;
  profileImageUrl: string;
  preparationStage: string;
  interestedRegions: string[];
  interestedCountries: string[];
}

export interface EmailSignUpRequest {
  email: string;
  password: string;
}

export interface EmailSignUpResponse {
  signUpToken: string;
}

export const authApi = {
  postSignOut: async (): Promise<SignOutResponse> => {
    const res = await axiosInstance.post<SignOutResponse>(`/auth/sign-out`);
    return res.data;
  },

  postAppleAuth: async (data: AppleAuthRequest): Promise<AppleAuthResponse> => {
    const res = await publicAxiosInstance.post<AppleAuthResponse>(`/auth/apple`, data);
    return res.data;
  },

  postRefreshToken: async (): Promise<RefreshTokenResponse> => {
    const res = await publicAxiosInstance.post<RefreshTokenResponse>(`/auth/reissue`);
    return res.data;
  },

  postEmailLogin: async (data: EmailLoginRequest): Promise<EmailLoginResponse> => {
    const res = await publicAxiosInstance.post<EmailLoginResponse>(`/auth/email/sign-in`, data);
    return res.data;
  },

  postEmailSignUp: async (data: EmailSignUpRequest): Promise<EmailSignUpResponse> => {
    const res = await publicAxiosInstance.post<EmailSignUpResponse>(`/auth/email/sign-up`, data);
    return res.data;
  },

  postKakaoAuth: async (data: KakaoAuthRequest): Promise<KakaoAuthResponse> => {
    const res = await publicAxiosInstance.post<KakaoAuthResponse>(`/auth/kakao`, data);
    return res.data;
  },

  deleteAccount: async (): Promise<AccountResponse> => {
    const res = await axiosInstance.delete<AccountResponse>(`/auth/quit`);
    return res.data;
  },

  postSignUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    // 임시 성별, 생년월일 추가. API 변경 시 삭제
    const payload = {
      ...data,
      birth: "2000-01-01",
      gender: "PREFER_NOT_TO_SAY",
    };
    const res = await publicAxiosInstance.post<SignUpResponse>(`/auth/sign-up`, payload);
    return res.data;
  },
};