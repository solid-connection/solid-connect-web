import apiClient from "@/utils/axiosClient";
import noAuthAxios from "@/utils/noAuthAxiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { KakaoSignUpResponse, RegisterRequest, RegisteredKakaoAuthReponse, UnregisteredKakaoAuthReponse } from "@/types/auth";

export const kakaoAuthApi = (code: string): Promise<AxiosResponse<ApiResponse<RegisteredKakaoAuthReponse | UnregisteredKakaoAuthReponse>>> => noAuthAxios.post("/auth/kakao", { code: code });

export const signUpApi = (signUpRequest: RegisterRequest): Promise<AxiosResponse<ApiResponse<KakaoSignUpResponse>>> => apiClient.post("/auth/sign-up", signUpRequest);

export const signOutApi = (): Promise<AxiosResponse<ApiResponse<null>>> => apiClient.post("/auth/sign-out");

export const deleteAccountApi = (): Promise<AxiosResponse<ApiResponse<null>>> => apiClient.patch("/auth/quit");

export const reissueAccessTokenApi = async (refreshToken: string): Promise<string> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.success && data.data && data.data.accessToken) {
      return data.data.accessToken;
    } else {
      throw new Error("Access token not found in the response");
    }
  } catch (error) {
    console.error("Error reissuing access token:", error);
    throw error;
  }
};
