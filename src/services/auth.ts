import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { KakaoSignUpResponse, RegisterRequest, RegisteredKakaoAuthReponse, UnregisteredKakaoAuthReponse } from "@/types/auth";

export const kakaoAuthApi = (code: string): Promise<AxiosResponse<ApiResponse<RegisteredKakaoAuthReponse | UnregisteredKakaoAuthReponse>>> => publicAxiosInstance.post("/auth/kakao", { code: code });

export const signUpApi = (signUpRequest: RegisterRequest): Promise<AxiosResponse<ApiResponse<KakaoSignUpResponse>>> => axiosInstance.post("/auth/sign-up", signUpRequest);

export const signOutApi = (): Promise<AxiosResponse<ApiResponse<null>>> => axiosInstance.post("/auth/sign-out");

export const deleteAccountApi = (): Promise<AxiosResponse<ApiResponse<null>>> => axiosInstance.patch("/auth/quit");

export const reissueAccessTokenPublicApi = () => {};
