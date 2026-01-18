import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { ReportType } from "@/types/reports";

// ====== Types ======
export interface UsePostReportsRequest {
  targetType: "POST"; // 지금은 게시글 신고 기능만 존재
  targetId: number; // 신고하려는 리소스의 ID
  reportType: ReportType;
}

// ====== API Functions ======
export const reportsApi = {
  /**
   * 신고 등록
   */
  postReport: async (body: UsePostReportsRequest): Promise<void> => {
    const response: AxiosResponse<void> = await axiosInstance.post(`/reports`, body);
    return response.data;
  },
};
