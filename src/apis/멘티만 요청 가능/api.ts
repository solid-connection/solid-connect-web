import { axiosInstance } from "@/utils/axiosInstance";

export interface 매칭된 멘토 목록ResponseContentItem {
  id: number;
  roomId: number;
  nickname: string;
  profileImageUrl: string;
  country: string;
  universityName: string;
  term: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: any[];
  isApplied: boolean;
}

export interface 매칭된 멘토 목록Response {
  content: 매칭된 멘토 목록ResponseContentItem[];
  nextPageNumber: number;
}

export interface 멘토링 신청Response {
  mentoringId: number;
}

export type 멘토링 신청Request = Record<string, never>;

export interface 멘토링 확인Response {
  checkedMentoringIds: number[];
}

export type 멘토링 확인Request = Record<string, never>;

export interface 신청한 멘토링 목록ResponseContentItem {
  mentoringId: number;
  profileImageUrl: null;
  nickname: string;
  isChecked: boolean;
  createdAt: string;
  chatRoomId: number;
}

export interface 신청한 멘토링 목록Response {
  content: 신청한 멘토링 목록ResponseContentItem[];
  nextPageNumber: number;
}

export const 멘티만 요청 가능Api = {
  get매칭된 멘토 목록: async (params: { defaultSize: string | number, defaultPage: string | number, params?: Record<string, any> }): Promise<매칭된 멘토 목록Response> => {
    const res = await axiosInstance.get<매칭된 멘토 목록Response>(
      `/mentee/mentorings/matched-mentors?size=${params.defaultSize}&page=${params.defaultPage}`, { params: params?.params }
    );
    return res.data;
  },

  post멘토링 신청: async (params: { data?: 멘토링 신청Request }): Promise<멘토링 신청Response> => {
    const res = await axiosInstance.post<멘토링 신청Response>(
      `/mentee/mentorings`, params?.data
    );
    return res.data;
  },

  patch멘토링 확인: async (params: { data?: 멘토링 확인Request }): Promise<멘토링 확인Response> => {
    const res = await axiosInstance.patch<멘토링 확인Response>(
      `/mentee/mentorings/check`, params?.data
    );
    return res.data;
  },

  get신청한 멘토링 목록: async (params: { verifyStatus: string | number, defaultSize: string | number, defaultPage: string | number, params?: Record<string, any> }): Promise<신청한 멘토링 목록Response> => {
    const res = await axiosInstance.get<신청한 멘토링 목록Response>(
      `/mentee/mentorings?verify-status=${params.verifyStatus}&size=${params.defaultSize}&page=${params.defaultPage}`, { params: params?.params }
    );
    return res.data;
  },

};