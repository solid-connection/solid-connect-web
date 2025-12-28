import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { MentoringListItem, VerifyStatus } from "@/types/mentee";
import { MentorCardDetail, MentorCardPreview, MentoringApprovalStatus, MentoringItem } from "@/types/mentor";

// QueryKeys for mentor domain
export const MentorQueryKeys = {
  myMentorProfile: "myMentorProfile",
  mentoringList: "mentoringList",
  mentoringNewCount: "mentoringNewCount",
  applyMentoringList: "applyMentoringList",
  mentorList: "mentorList",
  mentorDetail: "mentorDetail",
} as const;

// Re-export types
export type { MentorCardPreview, MentorCardDetail, MentoringItem, MentoringApprovalStatus };
export type { MentoringListItem, VerifyStatus };

// Response types
export interface MentoringListResponse {
  content: MentoringItem[];
  nextPageNumber: number;
}

export interface GetMentoringNewCountResponse {
  uncheckedCount: number;
}

export interface ApplyMentoringListResponse {
  content: MentoringListItem[];
  nextPageNumber: number;
}

export interface MentorListResponse {
  nextPageNumber: number;
  content: MentorCardDetail[];
}

export interface PatchApprovalStatusRequest {
  status: MentoringApprovalStatus;
  mentoringId: number;
}

export interface PatchApprovalStatusResponse {
  mentoringId: number;
  chatRoomId: number;
}

export interface PatchCheckMentoringsRequest {
  checkedMentoringIds: number[];
}

export interface PatchCheckMentoringsResponse {
  checkedMentoringIds: number[];
}

export interface PostApplyMentoringRequest {
  mentorId: number;
}

export interface PostApplyMentoringResponse {
  mentoringId: number;
}

export interface PostMentorApplicationRequest {
  interestedCountries: string[];
  country: string;
  universityName: string;
  studyStatus: "STUDYING" | "PLANNING" | "COMPLETED";
  verificationFile: File;
}

export interface PutMyMentorProfileRequest {
  channels: { type: string; url: string }[];
  passTip: string;
  introduction: string;
}

const OFFSET = 5;
const MENTORS_OFFSET = 10;
const MENTEE_OFFSET = 3;

export const mentorApi = {
  // === Mentor (멘토) APIs ===
  getMentorMyProfile: async (): Promise<MentorCardPreview> => {
    const res = await axiosInstance.get<MentorCardPreview>("/mentor/my");
    return res.data;
  },

  getMentoringList: async (page: number, size: number = OFFSET): Promise<MentoringListResponse> => {
    const endpoint = `/mentor/mentorings?size=${size}&page=${page}`;
    const res = await axiosInstance.get<MentoringListResponse>(endpoint);
    return res.data;
  },

  getMentoringUncheckedCount: async (): Promise<GetMentoringNewCountResponse> => {
    const endpoint = "/mentor/mentorings/check";
    const res = await axiosInstance.get<GetMentoringNewCountResponse>(endpoint);
    return res.data;
  },

  patchApprovalStatus: async (props: PatchApprovalStatusRequest): Promise<PatchApprovalStatusResponse> => {
    const { status, mentoringId } = props;
    const res = await axiosInstance.patch<PatchApprovalStatusResponse>(`/mentor/mentorings/${mentoringId}`, {
      status,
    });
    return res.data;
  },

  patchMentorCheckMentorings: async (body: PatchCheckMentoringsRequest): Promise<PatchCheckMentoringsResponse> => {
    const res = await axiosInstance.patch<PatchCheckMentoringsResponse>("/mentor/mentorings/check", body);
    return res.data;
  },

  postMentorApplication: async (body: PostMentorApplicationRequest): Promise<void> => {
    const formData = new FormData();
    const applicationData = {
      interestedCountries: body.interestedCountries,
      country: body.country,
      universityName: body.universityName,
      studyStatus: body.studyStatus,
    };
    formData.append(
      "mentorApplicationRequest",
      new Blob([JSON.stringify(applicationData)], { type: "application/json" }),
    );
    formData.append("file", body.verificationFile);
    const res = await axiosInstance.post<void>("/mentor/verification", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  putMyMentorProfile: async (body: PutMyMentorProfileRequest): Promise<void> => {
    const res = await axiosInstance.put<void>("/mentor/my", body);
    return res.data;
  },

  // === Mentee (멘티) APIs ===
  getApplyMentoringList: async (
    verifyStatus: VerifyStatus,
    page: number,
    size: number = MENTEE_OFFSET,
  ): Promise<ApplyMentoringListResponse> => {
    const res = await axiosInstance.get<ApplyMentoringListResponse>(
      `/mentee/mentorings?verify-status=${verifyStatus}&size=${size}&page=${page}`,
    );
    return res.data;
  },

  patchMenteeCheckMentorings: async (body: PatchCheckMentoringsRequest): Promise<PatchCheckMentoringsResponse> => {
    const res = await axiosInstance.patch<PatchCheckMentoringsResponse>("/mentee/mentorings/check", body);
    return res.data;
  },

  postApplyMentoring: async (body: PostApplyMentoringRequest): Promise<PostApplyMentoringResponse> => {
    const res = await axiosInstance.post<PostApplyMentoringResponse>("/mentee/mentorings", body);
    return res.data;
  },

  // === Mentors (멘토 목록) APIs ===
  getMentorList: async (region: string, page: number, size: number = MENTORS_OFFSET): Promise<MentorListResponse> => {
    const res = await axiosInstance.get<MentorListResponse>(`/mentors?region=${region}&page=${page}&size=${size}`);
    return res.data;
  },

  getMentorDetail: async (mentorId: number): Promise<MentorCardDetail> => {
    const res = await axiosInstance.get<MentorCardDetail>(`/mentors/${mentorId}`);
    return res.data;
  },
};
