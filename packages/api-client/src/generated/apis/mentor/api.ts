import { axiosInstance } from "../../../runtime/axiosInstance";

export type GetMatchedMentorsResponse = void;

export type PostApplyMentorApplicationResponse = void;

export type PostApplyMentorApplicationRequest = Record<string, never>;

export interface PostApplyMentoringResponse {
  mentoringId: number;
}

export type PostApplyMentoringRequest = Record<string, never>;

export interface PatchConfirmMentoringResponse {
  checkedMentoringIds: number[];
}

export type PatchConfirmMentoringRequest = Record<string, never>;

export interface GetAppliedMentoringsResponseContentItem {
  mentoringId: number;
  profileImageUrl: null;
  nickname: string;
  isChecked: boolean;
  createdAt: string;
  chatRoomId: number;
}

export interface GetAppliedMentoringsResponse {
  content: GetAppliedMentoringsResponseContentItem[];
  nextPageNumber: number;
}

export type GetMyMentorPageResponse = void;

export type PutUpdateMyMentorPageResponse = Record<string, never>;

export type PutUpdateMyMentorPageRequest = Record<string, never>;

export type PostCreateMentorMyPageResponse = void;

export type PostCreateMentorMyPageRequest = Record<string, never>;

export interface PatchMentoringStatusResponse {
  mentoringId: number;
}

export type PatchMentoringStatusRequest = Record<string, never>;

export interface PatchConfirmMentoring2Response {
  checkedMentoringIds: number[];
}

export type PatchConfirmMentoring2Request = Record<string, never>;

export interface GetReceivedMentoringsResponseContentItem {
  mentoringId: number;
  profileImageUrl: null;
  nickname: string;
  isChecked: boolean;
  verifyStatus: string;
  createdAt: string;
}

export interface GetReceivedMentoringsResponse {
  content: GetReceivedMentoringsResponseContentItem[];
  nextPageNumber: number;
}

export interface GetUnconfirmedMentoringCountResponse {
  uncheckedCount: number;
}

export type GetMentorListResponse = void;

export type GetMentorDetailResponse = void;

export const mentorApi = {
  getMatchedMentors: async (params: { params?: Record<string, unknown> }): Promise<GetMatchedMentorsResponse> => {
    const res = await axiosInstance.get<GetMatchedMentorsResponse>(
      `/mentee/mentorings/matched-mentors`, { params: params?.params }
    );
    return res.data;
  },

  postApplyMentorApplication: async (params: { data?: PostApplyMentorApplicationRequest }): Promise<PostApplyMentorApplicationResponse> => {
    const res = await axiosInstance.post<PostApplyMentorApplicationResponse>(
      `/mentees/mentor-applications`, params?.data
    );
    return res.data;
  },

  postApplyMentoring: async (params: { data?: PostApplyMentoringRequest }): Promise<PostApplyMentoringResponse> => {
    const res = await axiosInstance.post<PostApplyMentoringResponse>(
      `/mentee/mentorings`, params?.data
    );
    return res.data;
  },

  patchConfirmMentoring: async (params: { data?: PatchConfirmMentoringRequest }): Promise<PatchConfirmMentoringResponse> => {
    const res = await axiosInstance.patch<PatchConfirmMentoringResponse>(
      `/mentee/mentorings/check`, params?.data
    );
    return res.data;
  },

  getAppliedMentorings: async (params: { params?: Record<string, unknown> }): Promise<GetAppliedMentoringsResponse> => {
    const res = await axiosInstance.get<GetAppliedMentoringsResponse>(
      `/mentee/mentorings`, { params: params?.params }
    );
    return res.data;
  },

  getMyMentorPage: async (params: { params?: Record<string, unknown> }): Promise<GetMyMentorPageResponse> => {
    const res = await axiosInstance.get<GetMyMentorPageResponse>(
      `/mentor/my`, { params: params?.params }
    );
    return res.data;
  },

  putUpdateMyMentorPage: async (params: { data?: PutUpdateMyMentorPageRequest }): Promise<PutUpdateMyMentorPageResponse> => {
    const res = await axiosInstance.put<PutUpdateMyMentorPageResponse>(
      `/mentor/my`, params?.data
    );
    return res.data;
  },

  postCreateMentorMyPage: async (params: { data?: PostCreateMentorMyPageRequest }): Promise<PostCreateMentorMyPageResponse> => {
    const res = await axiosInstance.post<PostCreateMentorMyPageResponse>(
      `/mentor/my`, params?.data
    );
    return res.data;
  },

  patchMentoringStatus: async (params: { mentoringId: string | number, data?: PatchMentoringStatusRequest }): Promise<PatchMentoringStatusResponse> => {
    const res = await axiosInstance.patch<PatchMentoringStatusResponse>(
      `/mentor/mentorings/${params.mentoringId}`, params?.data
    );
    return res.data;
  },

  patchConfirmMentoring2: async (params: { data?: PatchConfirmMentoring2Request }): Promise<PatchConfirmMentoring2Response> => {
    const res = await axiosInstance.patch<PatchConfirmMentoring2Response>(
      `/mentor/mentorings/check`, params?.data
    );
    return res.data;
  },

  getReceivedMentorings: async (params: { params?: Record<string, unknown> }): Promise<GetReceivedMentoringsResponse> => {
    const res = await axiosInstance.get<GetReceivedMentoringsResponse>(
      `/mentor/mentorings`, { params: params?.params }
    );
    return res.data;
  },

  getUnconfirmedMentoringCount: async (params: { params?: Record<string, unknown> }): Promise<GetUnconfirmedMentoringCountResponse> => {
    const res = await axiosInstance.get<GetUnconfirmedMentoringCountResponse>(
      `/mentor/mentorings/check`, { params: params?.params }
    );
    return res.data;
  },

  getMentorList: async (params: { params?: Record<string, unknown> }): Promise<GetMentorListResponse> => {
    const res = await axiosInstance.get<GetMentorListResponse>(
      `/mentors`, { params: params?.params }
    );
    return res.data;
  },

  getMentorDetail: async (params: { siteUserId: string | number, params?: Record<string, unknown> }): Promise<GetMentorDetailResponse> => {
    const res = await axiosInstance.get<GetMentorDetailResponse>(
      `/mentors/${params.siteUserId}`, { params: params?.params }
    );
    return res.data;
  },

};