import { axiosInstance } from "@/utils/axiosInstance";

export type ReportResponse = Record<string, never>;

export type ReportRequest = Record<string, never>;

export const reportsApi = {
  postReport: async (params: { data?: ReportRequest }): Promise<ReportResponse> => {
    const res = await axiosInstance.post<ReportResponse>(
      `/reports`, params?.data
    );
    return res.data;
  },

};