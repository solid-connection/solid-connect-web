import type { AxiosResponse } from "axios";
import type { FileResponse } from "@/types/file";
import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

// ====== Types ======
export type SlackNotificationResponse = undefined;
export type SlackNotificationRequest = Record<string, never>;

export interface UploadLanguageTestReportResponse {
  fileUrl: string;
}

export interface UploadProfileImageResponse {
  fileUrl: string;
}

export interface UploadChatImageResponse {
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
    void params;
    throw new Error("Slack webhook notification must be proxied through a server-side endpoint.");
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
   * 채팅 이미지 업로드 (로그인 후)
   */
  postUploadChatImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await axiosInstance.post<UploadChatImageResponse[]>(`/file/chat`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.map((image) => image.fileUrl);
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
