import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { GpaScore, LanguageTestEnum, LanguageTestScore } from "@/types/score";

// ====== Query Keys ======
export const ScoresQueryKeys = {
  myGpaScore: "myGpaScore",
  myLanguageTestScore: "myLanguageTestScore",
} as const;

// ====== Types ======
export interface UseMyGpaScoreResponse {
  gpaScoreStatusResponseList: GpaScore[];
}

export interface UseGetMyLanguageTestScoreResponse {
  languageTestScoreStatusResponseList: LanguageTestScore[];
}

export interface UsePostGpaScoreRequest {
  gpaScoreRequest: {
    gpa: number;
    gpaCriteria: number;
    issueDate: string; // yyyy-MM-dd
  };
  file: Blob;
}

export interface UsePostLanguageTestScoreRequest {
  languageTestScoreRequest: {
    languageTestType: LanguageTestEnum;
    languageTestScore: string;
    issueDate: string; // yyyy-MM-dd
  };
  file: File;
}

// ====== API Functions ======
export const scoresApi = {
  /**
   * 내 학점 점수 조회
   */
  getMyGpaScore: async (): Promise<AxiosResponse<UseMyGpaScoreResponse>> => {
    return axiosInstance.get("/scores/gpas");
  },

  /**
   * 내 어학 점수 조회
   */
  getMyLanguageTestScore: async (): Promise<AxiosResponse<UseGetMyLanguageTestScoreResponse>> => {
    return axiosInstance.get("/scores/language-tests");
  },

  /**
   * 학점 점수 제출
   */
  postGpaScore: async (request: UsePostGpaScoreRequest): Promise<AxiosResponse<null>> => {
    const formData = new FormData();
    formData.append(
      "gpaScoreRequest",
      new Blob([JSON.stringify(request.gpaScoreRequest)], { type: "application/json" }),
    );
    formData.append("file", request.file);
    return axiosInstance.post("/scores/gpas", formData);
  },

  /**
   * 어학 점수 제출
   */
  postLanguageTestScore: async (request: UsePostLanguageTestScoreRequest): Promise<AxiosResponse<null>> => {
    const formData = new FormData();
    formData.append(
      "languageTestScoreRequest",
      new Blob([JSON.stringify(request.languageTestScoreRequest)], { type: "application/json" }),
    );
    formData.append("file", request.file);
    return axiosInstance.post("/scores/language-tests", formData);
  },
};
