import type { AxiosResponse } from "axios";
import type { ApplicationListResponse, ApplicationPreviewResponse } from "@/types/application";
import { axiosInstance } from "@/utils/axiosInstance";

// ====== Query Keys ======
export const ApplicationsQueryKeys = {
  competitorsApplicationList: "competitorsApplicationList",
  applicationPreview: "applicationPreview",
} as const;

// ====== Utils ======
/** 유효한 양의 정수만 쿼리 파라미터로 내보낸다. (universities/api.ts 와 동일한 규칙) */
const normalizePositiveInt = (value: unknown) => {
  const numberValue = typeof value === "string" && value.trim() !== "" ? Number(value) : value;

  return typeof numberValue === "number" && Number.isInteger(numberValue) && numberValue > 0 ? numberValue : undefined;
};

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
   *
   * homeUniversityId 는 클라이언트가 임의로 정하는 값이 아니라,
   * access token 에서 파싱된 로그인 사용자의 소속 대학(useAuthStore.homeUniversityId)을 그대로 전달한다.
   */
  getApplicationsList: async (params?: {
    homeUniversityId?: number | null;
  }): Promise<AxiosResponse<ApplicationListResponse>> => {
    return axiosInstance.get("/applications", {
      params: { homeUniversityId: normalizePositiveInt(params?.homeUniversityId) },
    });
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
