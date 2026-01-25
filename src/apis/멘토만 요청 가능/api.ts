import { axiosInstance } from "@/utils/axiosInstance";

export type 나의 멘토 페이지 수정Response = void;

export type 나의 멘토 페이지 수정Request = Record<string, never>;

export interface 나의 멘토 페이지 조회ResponseChannelsItem {
  type: string;
  url: string;
}

export interface 나의 멘토 페이지 조회Response {
  id: number;
  profileImageUrl: null;
  nickname: string;
  country: string;
  universityName: string;
  term: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  passTip: string;
  channels: 나의 멘토 페이지 조회ResponseChannelsItem[];
}

export interface 멘토링 수락거절Response {
  mentoringId: number;
}

export type 멘토링 수락거절Request = Record<string, never>;

export interface 멘토링 확인Response {
  checkedMentoringIds: number[];
}

export type 멘토링 확인Request = Record<string, never>;

export interface 신청받은 멘토링 목록ResponseContentItem {
  mentoringId: number;
  profileImageUrl: null;
  nickname: string;
  isChecked: boolean;
  verifyStatus: string;
  createdAt: string;
}

export interface 신청받은 멘토링 목록Response {
  content: 신청받은 멘토링 목록ResponseContentItem[];
  nextPageNumber: number;
}

export interface 확인하지 않은 멘토링 수Response {
  uncheckedCount: number;
}

export const 멘토만 요청 가능Api = {
  put나의 멘토 페이지 수정: async (params: { data?: 나의 멘토 페이지 수정Request }): Promise<나의 멘토 페이지 수정Response> => {
    const res = await axiosInstance.put<나의 멘토 페이지 수정Response>(
      `/mentor/my`, params?.data
    );
    return res.data;
  },

  get나의 멘토 페이지 조회: async (params: { params?: Record<string, any> }): Promise<나의 멘토 페이지 조회Response> => {
    const res = await axiosInstance.get<나의 멘토 페이지 조회Response>(
      `/mentor/my`, { params: params?.params }
    );
    return res.data;
  },

  patch멘토링 수락거절: async (params: { mentoringId: string | number, data?: 멘토링 수락거절Request }): Promise<멘토링 수락거절Response> => {
    const res = await axiosInstance.patch<멘토링 수락거절Response>(
      `/mentor/mentorings/${params.mentoringId}`, params?.data
    );
    return res.data;
  },

  patch멘토링 확인: async (params: { data?: 멘토링 확인Request }): Promise<멘토링 확인Response> => {
    const res = await axiosInstance.patch<멘토링 확인Response>(
      `/mentor/mentorings/check`, params?.data
    );
    return res.data;
  },

  get신청받은 멘토링 목록: async (params: { params?: Record<string, any> }): Promise<신청받은 멘토링 목록Response> => {
    const res = await axiosInstance.get<신청받은 멘토링 목록Response>(
      `/mentor/mentorings`, { params: params?.params }
    );
    return res.data;
  },

  get확인하지 않은 멘토링 수: async (params: { params?: Record<string, any> }): Promise<확인하지 않은 멘토링 수Response> => {
    const res = await axiosInstance.get<확인하지 않은 멘토링 수Response>(
      `/mentor/mentorings/check`, { params: params?.params }
    );
    return res.data;
  },

};