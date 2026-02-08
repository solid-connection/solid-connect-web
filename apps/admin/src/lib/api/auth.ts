import type { AxiosResponse } from "axios";
import { publicAxiosInstance } from "@/lib/api/client";
import type { AdminSignInResponse, ReissueAccessTokenResponse } from "@/types/auth";

export const adminSignInApi = (email: string, password: string): Promise<AxiosResponse<AdminSignInResponse>> =>
	publicAxiosInstance.post("/auth/email/sign-in", { email, password });

export const reissueAccessTokenApi = (refreshToken: string): Promise<AxiosResponse<ReissueAccessTokenResponse>> =>
	publicAxiosInstance.post(
		"/admin/auth/reissue",
		{},
		{
			headers: { Authorization: `Bearer ${refreshToken}` },
		},
	);
