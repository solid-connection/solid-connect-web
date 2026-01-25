import type { AxiosResponse } from "axios";
import type { ApplicationListResponse } from "@/types/application";
import { axiosInstance } from "@/utils/axiosInstance";

// ====== Query Keys ======
export const ApplicationsQueryKeys = {
  competitorsApplicationList: "competitorsApplicationList",
} as const;

// ====== Types ======
export interface UseSubmitApplicationResponse {
  isSuccess: boolean;
}

export interface UseSubmitApplicationRequest {
  gpaScoreId: number;
  languageTestScoreId: number;
  universityChoiceRequest: {
    firstChoiceUniversityId: number | null;
    secondChoiceUniversityId: number | null;
    thirdChoiceUniversityId: number | null;
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
  getCompetitors: async (config?: { params?: Record<string, any> }): Promise<CompetitorsResponse> => {
    const res = await axiosInstance.get<CompetitorsResponse>("/applications/competitors", config);
    return res.data;
  },
};
