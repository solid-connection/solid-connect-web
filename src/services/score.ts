import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { SubmitGpaScoreRequest, SubmitLanguageTestScoreRequest } from "@/types/score";

export const postGpaScoreApi = (request: SubmitGpaScoreRequest): Promise<AxiosResponse<null>> =>
  axiosInstance.post("/score/gpaScore", request);

export const postLanguageTestScoreApi = (request: SubmitLanguageTestScoreRequest): Promise<AxiosResponse<null>> =>
  axiosInstance.post("/score/languageTestScore", request);
