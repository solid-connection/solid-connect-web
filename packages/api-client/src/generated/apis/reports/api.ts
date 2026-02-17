import { axiosInstance } from "../../../runtime/axiosInstance";

export type PostReportResponse = Record<string, never>;

export type PostReportRequest = Record<string, never>;

export const reportsApi = {
  postReport: async (params: { data?: PostReportRequest }): Promise<PostReportResponse> => {
    const res = await axiosInstance.post<PostReportResponse>(
      `/reports`, params?.data
    );
    return res.data;
  },

};