import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import {
  ApplicationListResponse,
  ApplicationScoreRequest,
  ApplicationStatusResponse,
  ApplicationUniversityRequest,
  SubmitApplicationRequest,
  SubmitApplicationResponse,
} from "@/types/application";

// DEPRECATED
export const postApplicationScoreApi = (
  applicationScoreRequest: ApplicationScoreRequest,
): Promise<AxiosResponse<null>> => axiosInstance.post("/application/score", applicationScoreRequest);

// DEPRECATED
export const postApplicationUniversityApi = (
  applicationUniversityRequest: ApplicationUniversityRequest,
): Promise<AxiosResponse<null>> => axiosInstance.post("/application/university", applicationUniversityRequest);

export const postApplicationApi = (
  request: SubmitApplicationRequest,
): Promise<AxiosResponse<SubmitApplicationResponse>> => axiosInstance.post("/application", request);

export const getApplicationListApi = (): Promise<AxiosResponse<ApplicationListResponse>> =>
  axiosInstance.get("/application");

export const getMyApplicationStatusApi = (): Promise<AxiosResponse<ApplicationStatusResponse>> =>
  axiosInstance.get("/application/status");
