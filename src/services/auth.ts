import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { KakaoSignUpResponse, RegisterRequest, RegisteredKakaoAuthReponse, ReissueAccessTokenResponse, UnregisteredKakaoAuthReponse } from "@/types/auth";

export const kakaoAuthApi = (code: string): Promise<AxiosResponse<ApiResponse<RegisteredKakaoAuthReponse | UnregisteredKakaoAuthReponse>>> => {
  return publicAxiosInstance.post("/auth/kakao", { code: code });
};

export const signUpApi = (signUpRequest: RegisterRequest): Promise<AxiosResponse<ApiResponse<KakaoSignUpResponse>>> => {
  return axiosInstance.post("/auth/sign-up", signUpRequest);
};

export const signOutApi = (): Promise<AxiosResponse<ApiResponse<null>>> => {
  return axiosInstance.post("/auth/sign-out");
};

export const deleteAccountApi = (): Promise<AxiosResponse<ApiResponse<null>>> => {
  return axiosInstance.patch("/auth/quit");
};

export const reissueAccessTokenPublicApi = (refreshToken: string): Promise<AxiosResponse<ApiResponse<ReissueAccessTokenResponse>>> => {
  return publicAxiosInstance.post("/auth/reissue", {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
};
