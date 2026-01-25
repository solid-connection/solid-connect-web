import { axiosInstance } from "@/utils/axiosInstance";

export type 어학 검증 및 수정Response = void;

export type 어학 검증 및 수정Request = Record<string, never>;

export type 어학 조회Response = void;

export interface 학점 검증 및 수정Response {
  id: number;
  gpa: number;
  gpaCriteria: number;
  verifyStatus: string;
  rejectedReason: null;
}

export type 학점 검증 및 수정Request = Record<string, never>;

export type 학점조회Response = void;

export const 7) 어드민Api = {
  put어학 검증 및 수정: async (params: { languageTestScoreId: string | number, data?: 어학 검증 및 수정Request }): Promise<어학 검증 및 수정Response> => {
    const res = await axiosInstance.put<어학 검증 및 수정Response>(
      `/admin/scores/language-tests/${params.languageTestScoreId}`, params?.data
    );
    return res.data;
  },

  get어학 조회: async (params: { params?: Record<string, any> }): Promise<어학 조회Response> => {
    const res = await axiosInstance.get<어학 조회Response>(
      `/admin/scores/language-tests?page=1&size=10`, { params: params?.params }
    );
    return res.data;
  },

  put학점 검증 및 수정: async (params: { gpaScoreId: string | number, data?: 학점 검증 및 수정Request }): Promise<학점 검증 및 수정Response> => {
    const res = await axiosInstance.put<학점 검증 및 수정Response>(
      `/admin/scores/gpas/${params.gpaScoreId}`, params?.data
    );
    return res.data;
  },

  get학점조회: async (params: { params?: Record<string, any> }): Promise<학점조회Response> => {
    const res = await axiosInstance.get<학점조회Response>(
      `/admin/scores/gpas`, { params: params?.params }
    );
    return res.data;
  },

};