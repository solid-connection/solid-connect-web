import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import {
  MyGpaScoreResponse,
  MyLanguageTestScoreResponse,
  SubmitGpaScoreRequest,
  SubmitLanguageTestScoreRequest,
} from "@/types/score";

export const postGpaScoreApi = (request: SubmitGpaScoreRequest): Promise<AxiosResponse<null>> =>
  axiosInstance.post("/scores/gpas", request, { headers: { "Content-Type": "multipart/form-data" } });

export const postLanguageTestScoreApi = (request: SubmitLanguageTestScoreRequest): Promise<AxiosResponse<null>> =>
  axiosInstance.post("/scores/language-tests", request, { headers: { "Content-Type": "multipart/form-data" } });

export const getMyGpaScoreApi = (): Promise<AxiosResponse<MyGpaScoreResponse>> => axiosInstance.get("/scores/gpas");

export const getMyLanguageTestScoreApi = (): Promise<AxiosResponse<MyLanguageTestScoreResponse>> =>
  axiosInstance.get("/scores/language-tests");
