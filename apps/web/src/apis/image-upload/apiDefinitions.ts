import type { SlackNotificationRequest, SlackNotificationResponse, UploadGpaReportResponse, UploadLanguageTestReportResponse, UploadProfileImageBeforeSignupResponse, UploadProfileImageResponse } from './api';

export const imageUploadApiDefinitions = {
  postSlackNotification: {
    method: 'POST' as const,
    path: 'https://hooks.slack.com/services/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' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as SlackNotificationRequest,
    response: {} as SlackNotificationResponse,
  },
  postUploadLanguageTestReport: {
    method: 'POST' as const,
    path: '{{URL}}/file/language-test' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as UploadLanguageTestReportResponse,
  },
  postUploadProfileImage: {
    method: 'POST' as const,
    path: '{{URL}}/file/profile/post' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as UploadProfileImageResponse,
  },
  postUploadProfileImageBeforeSignup: {
    method: 'POST' as const,
    path: '{{URL}}/file/profile/pre' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as UploadProfileImageBeforeSignupResponse,
  },
  postUploadGpaReport: {
    method: 'POST' as const,
    path: '{{URL}}/file/gpa' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as UploadGpaReportResponse,
  },
} as const;

export type ImageUploadApiDefinitions = typeof imageUploadApiDefinitions;