import { axiosInstance } from "../../../runtime/axiosInstance";

export type PostSlackNotificationResponse = void;

export type PostSlackNotificationRequest = Record<string, never>;

export interface PostUploadLanguageTestReportResponse {
  fileUrl: string;
}

export type PostUploadLanguageTestReportRequest = Record<string, never>;

export interface PostUploadProfileImageResponse {
  fileUrl: string;
}

export type PostUploadProfileImageRequest = Record<string, never>;

export interface PostUploadProfileImageBeforeSignupResponse {
  fileUrl: string;
}

export type PostUploadProfileImageBeforeSignupRequest = Record<string, never>;

export interface PostUploadGpaReportResponse {
  fileUrl: string;
}

export type PostUploadGpaReportRequest = Record<string, never>;

export const imageUploadApi = {
  postSlackNotification: async (params: { data?: PostSlackNotificationRequest }): Promise<PostSlackNotificationResponse> => {
    const res = await axiosInstance.post<PostSlackNotificationResponse>(
      `https://hooks.slack.com/services/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`, params?.data
    );
    return res.data;
  },

  postUploadLanguageTestReport: async (params: { data?: PostUploadLanguageTestReportRequest }): Promise<PostUploadLanguageTestReportResponse> => {
    const res = await axiosInstance.post<PostUploadLanguageTestReportResponse>(
      `/file/language-test`, params?.data
    );
    return res.data;
  },

  postUploadProfileImage: async (params: { data?: PostUploadProfileImageRequest }): Promise<PostUploadProfileImageResponse> => {
    const res = await axiosInstance.post<PostUploadProfileImageResponse>(
      `/file/profile/post`, params?.data
    );
    return res.data;
  },

  postUploadProfileImageBeforeSignup: async (params: { data?: PostUploadProfileImageBeforeSignupRequest }): Promise<PostUploadProfileImageBeforeSignupResponse> => {
    const res = await axiosInstance.post<PostUploadProfileImageBeforeSignupResponse>(
      `/file/profile/pre`, params?.data
    );
    return res.data;
  },

  postUploadGpaReport: async (params: { data?: PostUploadGpaReportRequest }): Promise<PostUploadGpaReportResponse> => {
    const res = await axiosInstance.post<PostUploadGpaReportResponse>(
      `/file/gpa`, params?.data
    );
    return res.data;
  },

};