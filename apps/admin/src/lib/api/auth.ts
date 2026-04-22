import axios, { type AxiosResponse } from "axios";
import type { AdminSignInResponse, ReissueAccessTokenResponse } from "@/types/auth";

const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL?.trim();

if (!API_SERVER_URL) {
	throw new Error("[admin] VITE_API_SERVER_URL is required. Configure it in your environment.");
}

const authAxiosInstance = axios.create({
	baseURL: API_SERVER_URL,
	withCredentials: true,
});

export const adminSignInApi = (email: string, password: string): Promise<AxiosResponse<AdminSignInResponse>> =>
	authAxiosInstance.post("/auth/email/sign-in", { email, password });

export const reissueAccessTokenApi = (): Promise<AxiosResponse<ReissueAccessTokenResponse>> =>
	authAxiosInstance.post("/auth/reissue");
