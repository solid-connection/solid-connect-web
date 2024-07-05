import apiClient from "@/utils/axiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { ApplicationListResponse, ApplicationScoreRequest, ApplicationStatusResponse, ApplicationUniversityRequest } from "@/types/application";
import useFetch from "@/hooks/useFetch";

export const postApplicationScoreApi = (applicationScoreRequest: ApplicationScoreRequest): Promise<AxiosResponse<ApiResponse<null>>> => {
  return apiClient.post("/application/score", applicationScoreRequest);
};

export const postApplicationUniversityApi = (applicationUniversityRequest: ApplicationUniversityRequest): Promise<AxiosResponse<ApiResponse<null>>> => {
  return apiClient.post("/application/university", applicationUniversityRequest);
};

export const getApplicationListApi = (): Promise<AxiosResponse<ApiResponse<ApplicationListResponse>>> => {
  return apiClient.get("/application");
};

export const getMyApplicationStatusApi = (): Promise<AxiosResponse<ApiResponse<ApplicationStatusResponse>>> => {
  return apiClient.get("/application/status");
};

export const usePostApplicationScore = (data: ApplicationScoreRequest) => {
  return useFetch<ApiResponse<null>>("/application/score", "POST", data);
};

export const usePostApplicationUniversity = (data: ApplicationUniversityRequest) => {
  return useFetch<ApiResponse<null>>("/application/university", "POST", data);
};

export const useGetApplicationList = () => {
  return useFetch<ApiResponse<ApplicationListResponse>>("/application");
};

export const useGetMyApplicationStatus = () => {
  return useFetch<ApiResponse<ApplicationStatusResponse>>("/application/status");
};
