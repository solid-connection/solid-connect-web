import { axiosInstance } from "@/utils/axiosInstance";

export type SlackNotificationResponse = void;

export type SlackNotificationRequest = Record<string, never>;

export interface UploadLanguageTestReportResponse {
  fileUrl: string;
}

export type UploadLanguageTestReportRequest = Record<string, never>;

export interface UploadProfileImageResponse {
  fileUrl: string;
}

export type UploadProfileImageRequest = Record<string, never>;

export interface UploadProfileImageBeforeSignupResponse {
  fileUrl: string;
}

export type UploadProfileImageBeforeSignupRequest = Record<string, never>;

export interface UploadGpaReportResponse {
  fileUrl: string;
}

export type UploadGpaReportRequest = Record<string, never>;

export const imageUploadApi = {
  postSlackNotification: async (params: { data?: SlackNotificationRequest }): Promise<SlackNotificationResponse> => {
    const res = await axiosInstance.post<SlackNotificationResponse>(
      `https://hooks.slack.com/services/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`, params?.data
    );
    return res.data;
  },

  postUploadLanguageTestReport: async (params: { data?: UploadLanguageTestReportRequest }): Promise<UploadLanguageTestReportResponse> => {
    const res = await axiosInstance.post<UploadLanguageTestReportResponse>(
      `/file/language-test`, params?.data
    );
    return res.data;
  },

  postUploadProfileImage: async (params: { data?: UploadProfileImageRequest }): Promise<UploadProfileImageResponse> => {
    const res = await axiosInstance.post<UploadProfileImageResponse>(
      `/file/profile/post`, params?.data
    );
    return res.data;
  },

  postUploadProfileImageBeforeSignup: async (params: { data?: UploadProfileImageBeforeSignupRequest }): Promise<UploadProfileImageBeforeSignupResponse> => {
    const res = await axiosInstance.post<UploadProfileImageBeforeSignupResponse>(
      `/file/profile/pre`, params?.data
    );
    return res.data;
  },

  postUploadGpaReport: async (params: { data?: UploadGpaReportRequest }): Promise<UploadGpaReportResponse> => {
    const res = await axiosInstance.post<UploadGpaReportResponse>(
      `/file/gpa`, params?.data
    );
    return res.data;
  },

};