import type { PostSlackNotificationRequest, PostSlackNotificationResponse, PostUploadGpaReportResponse, PostUploadLanguageTestReportResponse, PostUploadProfileImageBeforeSignupResponse, PostUploadProfileImageResponse } from './api';

export const imageUploadApiDefinitions = {
  postSlackNotification: {
    method: 'POST' as const,
    path: 'https://hooks.slack.com/services/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' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as PostSlackNotificationRequest,
    response: undefined as unknown as PostSlackNotificationResponse,
  },
  postUploadLanguageTestReport: {
    method: 'POST' as const,
    path: '/file/language-test' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostUploadLanguageTestReportResponse,
  },
  postUploadProfileImage: {
    method: 'POST' as const,
    path: '/file/profile/post' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostUploadProfileImageResponse,
  },
  postUploadProfileImageBeforeSignup: {
    method: 'POST' as const,
    path: '/file/profile/pre' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostUploadProfileImageBeforeSignupResponse,
  },
  postUploadGpaReport: {
    method: 'POST' as const,
    path: '/file/gpa' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostUploadGpaReportResponse,
  },
} as const;

export type ImageUploadApiDefinitions = typeof imageUploadApiDefinitions;