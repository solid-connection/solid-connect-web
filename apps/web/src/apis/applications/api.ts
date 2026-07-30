import type { AxiosResponse } from "axios";
import type { ApplicationListResponse, ApplicationPreviewResponse } from "@/types/application";
import { axiosInstance } from "@/utils/axiosInstance";

// ====== Query Keys ======
export const ApplicationsQueryKeys = {
  competitorsApplicationList: "competitorsApplicationList",
  applicationPreview: "applicationPreview",
} as const;

// ====== Types ======
export interface UseSubmitApplicationResponse {
  isSuccess: boolean;
}

export interface UseSubmitApplicationRequest {
  gpaScoreId: number;
  languageTestScoreId: number;
  universityChoiceRequest: {
    choices: number[];
  };
}

export interface CompetitorsResponse {
  competitors: Array<{
    id: number;
    name: string;
    score: number;
  }>;
}

// ====== API Functions ======
export const applicationsApi = {
  /**
   * 지원 목록 조회
   */
  getApplicationsList: async (): Promise<AxiosResponse<ApplicationListResponse>> => {
    return axiosInstance.get("/applications");
  },

  /**
   * 지원자가 있는 대학의 제한 공개 정보 조회
   */
  getApplicationPreview: async (): Promise<AxiosResponse<ApplicationPreviewResponse>> => {
    return axiosInstance.get("/applications/preview");
  },

  /**
   * 지원 제출
   */
  postSubmitApplication: async (
    request: UseSubmitApplicationRequest,
  ): Promise<AxiosResponse<UseSubmitApplicationResponse>> => {
    return axiosInstance.post("/applications", request);
  },

  /**
   * 경쟁자 목록 조회
   */
  getCompetitors: async (config?: { params?: Record<string, unknown> }): Promise<CompetitorsResponse> => {
    const res = await axiosInstance.get<CompetitorsResponse>("/applications/competitors", config);
    return res.data;
  },
};
