import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { ApplicationListResponse, ApplicationScoreRequest, ApplicationStatusResponse, ApplicationUniversityRequest } from "@/types/application";

export const postApplicationScoreApi = (applicationScoreRequest: ApplicationScoreRequest): Promise<AxiosResponse<ApiResponse<null>>> => axiosInstance.post("/application/score", applicationScoreRequest);

export const postApplicationUniversityApi = (applicationUniversityRequest: ApplicationUniversityRequest): Promise<AxiosResponse<ApiResponse<null>>> => axiosInstance.post("/application/university", applicationUniversityRequest);

export const getApplicationListApi = (): Promise<AxiosResponse<ApiResponse<ApplicationListResponse>>> => axiosInstance.get("/application");

export const getMyApplicationStatusApi = (): Promise<AxiosResponse<ApiResponse<ApplicationStatusResponse>>> => axiosInstance.get("/application/status");
