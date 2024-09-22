import { AxiosResponse } from "axios";

// eslint-disable-next-line import/no-cycle
import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import {
  KakaoSignUpResponse,
  RegisterRequest,
  RegisteredKakaoAuthReponse,
  ReissueAccessTokenResponse,
  UnregisteredKakaoAuthReponse,
} from "@/types/auth";

export const kakaoAuthApi = (
  code: string,
): Promise<AxiosResponse<RegisteredKakaoAuthReponse | UnregisteredKakaoAuthReponse>> =>
  publicAxiosInstance.post("/auth/kakao", { code });

export const signUpApi = (signUpRequest: RegisterRequest): Promise<AxiosResponse<KakaoSignUpResponse>> =>
  publicAxiosInstance.post("/auth/sign-up", signUpRequest);

export const signOutApi = (): Promise<AxiosResponse<null>> => axiosInstance.post("/auth/sign-out");

export const deleteAccountApi = (): Promise<AxiosResponse<null>> => axiosInstance.patch("/auth/quit");

export const reissueAccessTokenPublicApi = (refreshToken: string): Promise<AxiosResponse<ReissueAccessTokenResponse>> =>
  publicAxiosInstance.post("/auth/reissue", {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
