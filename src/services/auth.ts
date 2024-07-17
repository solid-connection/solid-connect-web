import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { KakaoSignUpResponse, RegisterRequest, RegisteredKakaoAuthReponse, ReissueAccessTokenResponse, UnregisteredKakaoAuthReponse } from "@/types/auth";

export const kakaoAuthApi = (code: string): Promise<AxiosResponse<RegisteredKakaoAuthReponse | UnregisteredKakaoAuthReponse>> => {
  return publicAxiosInstance.post("/auth/kakao", { code: code });
};

export const signUpApi = (signUpRequest: RegisterRequest): Promise<AxiosResponse<KakaoSignUpResponse>> => {
  return axiosInstance.post("/auth/sign-up", signUpRequest);
};

export const signOutApi = (): Promise<AxiosResponse<null>> => {
  return axiosInstance.post("/auth/sign-out");
};

export const deleteAccountApi = (): Promise<AxiosResponse<null>> => {
  return axiosInstance.patch("/auth/quit");
};

export const reissueAccessTokenPublicApi = (refreshToken: string): Promise<AxiosResponse<ReissueAccessTokenResponse>> => {
  return publicAxiosInstance.post("/auth/reissue", {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
};
