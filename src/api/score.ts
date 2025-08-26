import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import {
  MyGpaScoreResponse,
  MyLanguageTestScoreResponse,
  SubmitGpaScoreRequest,
  SubmitLanguageTestScoreRequest,
} from "@/types/score";

export const postGpaScoreApi = (request: SubmitGpaScoreRequest): Promise<AxiosResponse<null>> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "gpaScoreRequest",
    new Blob([JSON.stringify(request.gpaScoreRequest)], { type: "application/json" }),
  );
  convertedRequest.append("file", request.file);
  return axiosInstance.post("/scores/gpas", convertedRequest);
};

export const postLanguageTestScoreApi = (request: SubmitLanguageTestScoreRequest): Promise<AxiosResponse<null>> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "languageTestScoreRequest",
    new Blob([JSON.stringify(request.languageTestScoreRequest)], { type: "application/json" }),
  );
  convertedRequest.append("file", request.file);
  return axiosInstance.post("/scores/language-tests", convertedRequest);
};

export const getMyGpaScoreApi = (): Promise<AxiosResponse<MyGpaScoreResponse>> => axiosInstance.get("/scores/gpas");

export const getMyLanguageTestScoreApi = (): Promise<AxiosResponse<MyLanguageTestScoreResponse>> =>
  axiosInstance.get("/scores/language-tests");
