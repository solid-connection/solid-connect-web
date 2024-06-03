import apiClient from "@/lib/axiosClient";
import noAuthAxios from "@/lib/noAuthAxiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { KakaoSignUpResponse, RegisterRequest, RegisteredKakaoAuthReponse, UnregisteredKakaoAuthReponse } from "@/types/auth";

export const kakaoAuthApi = (code: string): Promise<AxiosResponse<ApiResponse<RegisteredKakaoAuthReponse | UnregisteredKakaoAuthReponse>>> => noAuthAxios.post("/auth/kakao", { code: code });

export const signUpApi = (signUpRequest: RegisterRequest): Promise<AxiosResponse<ApiResponse<KakaoSignUpResponse>>> => apiClient.post("/auth/sign-up", signUpRequest);

export const signOutApi = (): Promise<AxiosResponse<ApiResponse<null>>> => apiClient.post("/auth/sign-out");

export const deleteAccountApi = (): Promise<AxiosResponse<ApiResponse<null>>> => apiClient.patch("/auth/quit");

export const reissueAccessTokenApi = () => {};
