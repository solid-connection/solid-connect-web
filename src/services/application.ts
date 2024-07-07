import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { ApplicationListResponse, ApplicationScoreRequest, ApplicationStatusResponse, ApplicationUniversityRequest } from "@/types/application";

export const postApplicationScoreApi = (applicationScoreRequest: ApplicationScoreRequest): Promise<AxiosResponse<ApiResponse<null>>> => {
  return axiosInstance.post("/application/score", applicationScoreRequest);
};

export const postApplicationUniversityApi = (applicationUniversityRequest: ApplicationUniversityRequest): Promise<AxiosResponse<ApiResponse<null>>> => {
  return axiosInstance.post("/application/university", applicationUniversityRequest);
};

export const getApplicationListApi = (): Promise<AxiosResponse<ApiResponse<ApplicationListResponse>>> => {
  return axiosInstance.get("/application");
};

export const getMyApplicationStatusApi = (): Promise<AxiosResponse<ApiResponse<ApplicationStatusResponse>>> => {
  return axiosInstance.get("/application/status");
};
