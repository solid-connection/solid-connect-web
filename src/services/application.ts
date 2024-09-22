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
): Promise<AxiosResponse<null>> => axiosInstance.post("/application/score", applicationScoreRequest);

export const postApplicationUniversityApi = (
  applicationUniversityRequest: ApplicationUniversityRequest,
): Promise<AxiosResponse<null>> => axiosInstance.post("/application/university", applicationUniversityRequest);

export const getApplicationListApi = (): Promise<AxiosResponse<ApplicationListResponse>> =>
  axiosInstance.get("/application");

export const getMyApplicationStatusApi = (): Promise<AxiosResponse<ApplicationStatusResponse>> =>
  axiosInstance.get("/application/status");
