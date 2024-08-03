import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import {
  ApplicationListResponse,
  ApplicationScoreRequest,
  ApplicationStatusResponse,
  ApplicationUniversityRequest,
} from "@/types/application";

export const postApplicationScoreApi = (
  applicationScoreRequest: ApplicationScoreRequest,
): Promise<AxiosResponse<null>> => {
  return axiosInstance.post("/application/score", applicationScoreRequest);
};

export const postApplicationUniversityApi = (
  applicationUniversityRequest: ApplicationUniversityRequest,
): Promise<AxiosResponse<null>> => {
  return axiosInstance.post("/application/university", applicationUniversityRequest);
};

export const getApplicationListApi = (): Promise<AxiosResponse<ApplicationListResponse>> => {
  return axiosInstance.get("/application");
};

export const getMyApplicationStatusApi = (): Promise<AxiosResponse<ApplicationStatusResponse>> => {
  return axiosInstance.get("/application/status");
};
