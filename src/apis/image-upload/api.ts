import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { FileResponse } from "@/types/file";

// ====== Types ======
export type SlackNotificationResponse = void;
export type SlackNotificationRequest = Record<string, never>;

export interface UploadLanguageTestReportResponse {
  fileUrl: string;
}

export interface UploadProfileImageResponse {
  fileUrl: string;
}

export interface UploadGpaReportResponse {
  fileUrl: string;
}

// ====== API Functions ======
export const imageUploadApi = {
  /**
   * 슬랙 알림 전송
   */
  postSlackNotification: async (params: { data?: SlackNotificationRequest }): Promise<SlackNotificationResponse> => {
    const res = await axiosInstance.post<SlackNotificationResponse>(
      `https://hooks.slack.com/services/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`,
      params?.data,
    );
    return res.data;
  },

  /**
   * 어학 성적 증명서 업로드
   */
  postUploadLanguageTestReport: async (file: File): Promise<UploadLanguageTestReportResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post<UploadLanguageTestReportResponse>(`/file/language-test`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * 프로필 이미지 업로드 (로그인 후)
   */
  postUploadProfileImage: async (file: File): Promise<UploadProfileImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post<UploadProfileImageResponse>(`/file/profile/post`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * 프로필 이미지 업로드 (회원가입 전, 공개 API)
   */
  postUploadProfileImageBeforeSignup: async (file: File): Promise<FileResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response: AxiosResponse<FileResponse> = await publicAxiosInstance.post("/file/profile/pre", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * 학점 증명서 업로드
   */
  postUploadGpaReport: async (file: File): Promise<UploadGpaReportResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post<UploadGpaReportResponse>(`/file/gpa`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
