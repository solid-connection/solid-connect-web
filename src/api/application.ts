import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { ApplicationListResponse, SubmitApplicationRequest, SubmitApplicationResponse } from "@/types/application";

export const postApplicationApi = (
  request: SubmitApplicationRequest,
): Promise<AxiosResponse<SubmitApplicationResponse>> => axiosInstance.post("/applications", request);

export const getApplicationListApi = (): Promise<AxiosResponse<ApplicationListResponse>> =>
  axiosInstance.get("/applications");

export const getCompetitorsApplicationListApi = (): Promise<AxiosResponse<ApplicationListResponse>> =>
  axiosInstance.get("/applications/competitors");
