import { axiosInstance } from "@/utils/axiosInstance";

export type 멘토 목록 조회Response = void;

export type 멘토 상세 페이지Response = void;

export const 멘토 mentorApi = {
  get멘토 목록 조회: async (params: { defaultSize: string | number, defaultPage: string | number, params?: Record<string, any> }): Promise<멘토 목록 조회Response> => {
    const res = await axiosInstance.get<멘토 목록 조회Response>(
      `/mentors?region=미주권&size=${params.defaultSize}&page=${params.defaultPage}`, { params: params?.params }
    );
    return res.data;
  },

  get멘토 상세 페이지: async (params: { mentorId: string | number, params?: Record<string, any> }): Promise<멘토 상세 페이지Response> => {
    const res = await axiosInstance.get<멘토 상세 페이지Response>(
      `/mentors/${params.mentorId}`, { params: params?.params }
    );
    return res.data;
  },

};