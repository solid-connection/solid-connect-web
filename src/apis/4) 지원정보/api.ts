import { axiosInstance } from "@/utils/axiosInstance";

export type 나의 지원과 동일한 지원자 현황 조회Response = void;

export interface 지원서 제출ResponseAppliedUniversities {
  firstChoiceUniversity: string;
  secondChoiceUniversity: string;
  thirdChoiceUniversity: string;
}

export interface 지원서 제출Response {
  totalApplyCount: number;
  applyCount: number;
  appliedUniversities: 지원서 제출ResponseAppliedUniversities;
}

export type 지원서 제출Request = Record<string, never>;

export type 지원자 현황 조회Response = void;

export const 4) 지원정보Api = {
  get나의 지원과 동일한 지원자 현황 조회: async (params: { params?: Record<string, any> }): Promise<나의 지원과 동일한 지원자 현황 조회Response> => {
    const res = await axiosInstance.get<나의 지원과 동일한 지원자 현황 조회Response>(
      `/applications/competitors`, { params: params?.params }
    );
    return res.data;
  },

  post지원서 제출: async (params: { data?: 지원서 제출Request }): Promise<지원서 제출Response> => {
    const res = await axiosInstance.post<지원서 제출Response>(
      `/applications`, params?.data
    );
    return res.data;
  },

  get지원자 현황 조회: async (params: { params?: Record<string, any> }): Promise<지원자 현황 조회Response> => {
    const res = await axiosInstance.get<지원자 현황 조회Response>(
      `/applications`, { params: params?.params }
    );
    return res.data;
  },

};