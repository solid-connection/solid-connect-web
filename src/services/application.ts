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
): Promise<AxiosResponse<null>> => axiosInstance.post("/applications/score", applicationScoreRequest);

// DEPRECATED
export const postApplicationUniversityApi = (
  applicationUniversityRequest: ApplicationUniversityRequest,
): Promise<AxiosResponse<null>> => axiosInstance.post("/applications/university", applicationUniversityRequest);

export const postApplicationApi = (
  request: SubmitApplicationRequest,
): Promise<AxiosResponse<SubmitApplicationResponse>> => axiosInstance.post("/applications", request);

export const getApplicationListApi = (): Promise<AxiosResponse<ApplicationListResponse>> =>
  axiosInstance.get("/applications");

// DEPRECATED
export const getMyApplicationStatusApi = (): Promise<AxiosResponse<ApplicationStatusResponse>> =>
  axiosInstance.get("/applications/status");
