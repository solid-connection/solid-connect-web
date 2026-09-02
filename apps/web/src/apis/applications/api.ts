import type { AxiosResponse } from "axios";
import type { ApplicationListResponse, ApplicationPreviewResponse } from "@/types/application";
import type { RegionEnum } from "@/types/university";
import { axiosInstance } from "@/utils/axiosInstance";

export const ApplicationsQueryKeys = {
  applicationPreview: "applicationPreview",
} as const;

// ====== Types ======
export interface UseSubmitApplicationResponse {
  totalApplyCount: number;
  applyCount: number;
  appliedUniversities: {
    choices: string[];
  };
}

export interface UseSubmitApplicationRequest {
  gpaScoreId: number;
  languageTestScoreId: number;
  universityChoiceRequest: {
    choices: number[];
  };
}

export type ApplicantsSearchParams = {
  region?: RegionEnum;
  keyword?: string;
};
// ====== API Functions ======
export const applicationsApi = {
  /**
   * 전체 지원자 현황 조회
   */
  getApplicationsList: async (params?: ApplicantsSearchParams): Promise<AxiosResponse<ApplicationListResponse>> => {
    return axiosInstance.get("/applications", { params });
  },

  /**
   * 내가 지원한 대학의 경쟁자 현황 조회
   *
   * 서버에서 현재 사용자의 지원 대학만 반환하므로, 클라이언트에서 소속 대학 기준으로
   * 다시 필터링하지 않는다.
   */
  getCompetitors: async (): Promise<AxiosResponse<ApplicationListResponse>> => {
    return axiosInstance.get("/applications/competitors");
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
};
