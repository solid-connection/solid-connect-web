import { AxiosResponse } from "axios";

// eslint-disable-next-line import/no-cycle
import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import {
  EmailSignInResponse,
  EmailSignUpRequest,
  EmailSignUpResponse,
  RegisteredAppleAuthResponse,
  RegisteredKakaoAuthReponse,
  ReissueAccessTokenResponse,
  SignUpRequest,
  SignUpResponse,
  UnregisteredAppleAuthResponse,
  UnregisteredKakaoAuthReponse,
} from "@/types/auth";

export const kakaoAuthApi = (
  code: string,
): Promise<AxiosResponse<RegisteredKakaoAuthReponse | UnregisteredKakaoAuthReponse>> =>
  publicAxiosInstance.post("/auth/kakao", { code });

export const appleAuthApi = (
  code: string,
): Promise<AxiosResponse<RegisteredAppleAuthResponse | UnregisteredAppleAuthResponse>> =>
  publicAxiosInstance.post("/auth/apple", { code });

export const emailAuthApi = (email: string, password: string): Promise<AxiosResponse<EmailSignInResponse>> =>
  publicAxiosInstance.post("/auth/email/sign-in", { email, password });

export const emailSignUpApi = (signUpRequest: EmailSignUpRequest): Promise<AxiosResponse<EmailSignUpResponse>> =>
  publicAxiosInstance.post("/auth/email/sign-up", signUpRequest);

export const signUpApi = (signUpRequest: SignUpRequest): Promise<AxiosResponse<SignUpResponse>> => {
  // 임시 성별, 생년월일 추가. API 변경 시 삭제
  signUpRequest["birth"] = "2000-01-01";
  signUpRequest["gender"] = "PREFER_NOT_TO_SAY";

  return publicAxiosInstance.post("/auth/sign-up", signUpRequest);
};

export const signOutApi = (): Promise<AxiosResponse<null>> => axiosInstance.post("/auth/sign-out");

export const deleteAccountApi = (): Promise<AxiosResponse<null>> => axiosInstance.patch("/auth/quit");

export const reissueAccessTokenPublicApi = (refreshToken: string): Promise<AxiosResponse<ReissueAccessTokenResponse>> =>
  publicAxiosInstance.post("/auth/reissue", {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
