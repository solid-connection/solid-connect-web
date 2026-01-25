import { axiosInstance } from "@/utils/axiosInstance";

export type 슬랙 알림Response = void;

export type 슬랙 알림Request = Record<string, never>;

export interface 어학 성적표 업로드Response {
  fileUrl: string;
}

export type 어학 성적표 업로드Request = Record<string, never>;

export interface 프로필 사진 업로드 (가입 전)Response {
  fileUrl: string;
}

export type 프로필 사진 업로드 (가입 전)Request = Record<string, never>;

export interface 프로필 사진 업로드 (가입 후)Response {
  fileUrl: string;
}

export type 프로필 사진 업로드 (가입 후)Request = Record<string, never>;

export interface 학적 성적표 업로드Response {
  fileUrl: string;
}

export type 학적 성적표 업로드Request = Record<string, never>;

export const image UploadApi = {
  post슬랙 알림: async (params: { data?: 슬랙 알림Request }): Promise<슬랙 알림Response> => {
    const res = await axiosInstance.post<슬랙 알림Response>(
      `https://hooks.slack.com/services/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`, params?.data
    );
    return res.data;
  },

  post어학 성적표 업로드: async (params: { data?: 어학 성적표 업로드Request }): Promise<어학 성적표 업로드Response> => {
    const res = await axiosInstance.post<어학 성적표 업로드Response>(
      `/file/language-test`, params?.data
    );
    return res.data;
  },

  post프로필 사진 업로드 (가입 전): async (params: { data?: 프로필 사진 업로드 (가입 전)Request }): Promise<프로필 사진 업로드 (가입 전)Response> => {
    const res = await axiosInstance.post<프로필 사진 업로드 (가입 전)Response>(
      `/file/profile/pre`, params?.data
    );
    return res.data;
  },

  post프로필 사진 업로드 (가입 후): async (params: { data?: 프로필 사진 업로드 (가입 후)Request }): Promise<프로필 사진 업로드 (가입 후)Response> => {
    const res = await axiosInstance.post<프로필 사진 업로드 (가입 후)Response>(
      `/file/profile/post`, params?.data
    );
    return res.data;
  },

  post학적 성적표 업로드: async (params: { data?: 학적 성적표 업로드Request }): Promise<학적 성적표 업로드Response> => {
    const res = await axiosInstance.post<학적 성적표 업로드Response>(
      `/file/gpa`, params?.data
    );
    return res.data;
  },

};