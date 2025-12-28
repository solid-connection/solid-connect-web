import { axiosInstance } from "@/utils/axiosInstance";

export interface MatchedMentorsResponseContentItem {
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
  channels: MatchedMentorsResponseContentItemChannelsItem[];
  isApplied: boolean;
}

export interface MatchedMentorsResponseContentItemChannelsItem {
  type: string;
  url: string;
}

export interface MatchedMentorsResponse {
  content: MatchedMentorsResponseContentItem[];
  nextPageNumber: number;
}

export interface ApplyMentoringResponse {
  mentoringId: number;
}

export type ApplyMentoringRequest = Record<string, never>;

export interface ConfirmMentoringResponse {
  checkedMentoringIds: number[];
}

export type ConfirmMentoringRequest = Record<string, never>;

export interface AppliedMentoringsResponseContentItem {
  mentoringId: number;
  profileImageUrl: null;
  nickname: string;
  isChecked: boolean;
  createdAt: string;
  chatRoomId: number;
}

export interface AppliedMentoringsResponse {
  content: AppliedMentoringsResponseContentItem[];
  nextPageNumber: number;
}

export interface MentorListResponseContentItem {
  id: number;
  profileImageUrl: string;
  nickname: string;
  country: string;
  universityName: string;
  term: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: MentorListResponseContentItemChannelsItem[];
  isApplied: boolean;
}

export interface MentorListResponseContentItemChannelsItem {
  type: string;
  url: string;
}

export interface MentorListResponse {
  nextPageNumber: number;
  content: MentorListResponseContentItem[];
}

export interface MentorDetailResponseChannelsItem {
  type: string;
  url: string;
}

export interface MentorDetailResponse {
  id: number;
  profileImageUrl: string;
  nickname: string;
  country: string;
  universityName: string;
  term: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: MentorDetailResponseChannelsItem[];
  passTip: string;
  isApplied: boolean;
}

export interface MyMentorPageResponseChannelsItem {
  type: string;
  url: string;
}

export interface MyMentorPageResponse {
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
  channels: MyMentorPageResponseChannelsItem[];
}

export type UpdateMyMentorPageResponse = Record<string, never>;

export type UpdateMyMentorPageRequest = Record<string, never>;

export interface MentoringStatusResponse {
  mentoringId: number;
}

export type MentoringStatusRequest = Record<string, never>;

export interface ReceivedMentoringsResponseContentItem {
  mentoringId: number;
  profileImageUrl: null;
  nickname: string;
  isChecked: boolean;
  verifyStatus: string;
  createdAt: string;
}

export interface ReceivedMentoringsResponse {
  content: ReceivedMentoringsResponseContentItem[];
  nextPageNumber: number;
}

export interface UnconfirmedMentoringCountResponse {
  uncheckedCount: number;
}

export const mentorApi = {
  getMatchedMentors: async (params: { defaultSize: string | number, defaultPage: string | number, params?: Record<string, any> }): Promise<MatchedMentorsResponse> => {
    const res = await axiosInstance.get<MatchedMentorsResponse>(
      `/mentee/mentorings/matched-mentors?size=${params.defaultSize}&page=${params.defaultPage}`, { params: params?.params }
    );
    return res.data;
  },

  postApplyMentoring: async (params: { data?: ApplyMentoringRequest }): Promise<ApplyMentoringResponse> => {
    const res = await axiosInstance.post<ApplyMentoringResponse>(
      `/mentee/mentorings`, params?.data
    );
    return res.data;
  },

  patchConfirmMentoring: async (params: { data?: ConfirmMentoringRequest }): Promise<ConfirmMentoringResponse> => {
    const res = await axiosInstance.patch<ConfirmMentoringResponse>(
      `/mentee/mentorings/check`, params?.data
    );
    return res.data;
  },

  getAppliedMentorings: async (params: { verifyStatus: string | number, defaultSize: string | number, defaultPage: string | number, params?: Record<string, any> }): Promise<AppliedMentoringsResponse> => {
    const res = await axiosInstance.get<AppliedMentoringsResponse>(
      `/mentee/mentorings?verify-status=${params.verifyStatus}&size=${params.defaultSize}&page=${params.defaultPage}`, { params: params?.params }
    );
    return res.data;
  },

  getMentorList: async (params: { defaultSize: string | number, defaultPage: string | number, params?: Record<string, any> }): Promise<MentorListResponse> => {
    const res = await axiosInstance.get<MentorListResponse>(
      `/mentors?region=미주권&size=${params.defaultSize}&page=${params.defaultPage}`, { params: params?.params }
    );
    return res.data;
  },

  getMentorDetail: async (params: { mentorId: string | number, params?: Record<string, any> }): Promise<MentorDetailResponse> => {
    const res = await axiosInstance.get<MentorDetailResponse>(
      `/mentors/${params.mentorId}`, { params: params?.params }
    );
    return res.data;
  },

  getMyMentorPage: async (params: { params?: Record<string, any> }): Promise<MyMentorPageResponse> => {
    const res = await axiosInstance.get<MyMentorPageResponse>(
      `/mentor/my`, { params: params?.params }
    );
    return res.data;
  },

  putUpdateMyMentorPage: async (params: { data?: UpdateMyMentorPageRequest }): Promise<UpdateMyMentorPageResponse> => {
    const res = await axiosInstance.put<UpdateMyMentorPageResponse>(
      `/mentor/my`, params?.data
    );
    return res.data;
  },

  patchMentoringStatus: async (params: { mentoringId: string | number, data?: MentoringStatusRequest }): Promise<MentoringStatusResponse> => {
    const res = await axiosInstance.patch<MentoringStatusResponse>(
      `/mentor/mentorings/${params.mentoringId}`, params?.data
    );
    return res.data;
  },

  patchConfirmMentoring: async (params: { data?: ConfirmMentoringRequest }): Promise<ConfirmMentoringResponse> => {
    const res = await axiosInstance.patch<ConfirmMentoringResponse>(
      `/mentor/mentorings/check`, params?.data
    );
    return res.data;
  },

  getReceivedMentorings: async (params: { params?: Record<string, any> }): Promise<ReceivedMentoringsResponse> => {
    const res = await axiosInstance.get<ReceivedMentoringsResponse>(
      `/mentor/mentorings`, { params: params?.params }
    );
    return res.data;
  },

  getUnconfirmedMentoringCount: async (params: { params?: Record<string, any> }): Promise<UnconfirmedMentoringCountResponse> => {
    const res = await axiosInstance.get<UnconfirmedMentoringCountResponse>(
      `/mentor/mentorings/check`, { params: params?.params }
    );
    return res.data;
  },

};