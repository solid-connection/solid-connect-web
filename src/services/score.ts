import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import {
  MyGpaScoreResponse,
  MyLanguageTestScoreResponse,
  SubmitGpaScoreRequest,
  SubmitLanguageTestScoreRequest,
} from "@/types/score";

export const postGpaScoreApi = (request: SubmitGpaScoreRequest): Promise<AxiosResponse<null>> =>
  axiosInstance.post("/score/gpa", request);

export const postLanguageTestScoreApi = (request: SubmitLanguageTestScoreRequest): Promise<AxiosResponse<null>> =>
  axiosInstance.post("/score/languageTest", request);

export const getMyGpaScoreApi = (): Promise<AxiosResponse<MyGpaScoreResponse>> => axiosInstance.get("/score/gpa");

export const getMyLanguageTestScoreApi = (): Promise<AxiosResponse<MyLanguageTestScoreResponse>> =>
  axiosInstance.get("/score/languageTest");
