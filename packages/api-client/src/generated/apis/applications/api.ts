import { axiosInstance } from "../../../runtime/axiosInstance";

export interface GetCompetitorsResponseThirdChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: GetCompetitorsResponseThirdChoiceItemApplicantsItem[];
}

export interface GetCompetitorsResponseThirdChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface GetCompetitorsResponseSecondChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: GetCompetitorsResponseSecondChoiceItemApplicantsItem[];
}

export interface GetCompetitorsResponseSecondChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface GetCompetitorsResponseFirstChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: GetCompetitorsResponseFirstChoiceItemApplicantsItem[];
}

export interface GetCompetitorsResponseFirstChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface GetCompetitorsResponse {
  firstChoice: GetCompetitorsResponseFirstChoiceItem[];
  secondChoice: GetCompetitorsResponseSecondChoiceItem[];
  thirdChoice: GetCompetitorsResponseThirdChoiceItem[];
}

export interface PostSubmitApplicationResponseAppliedUniversities {
  firstChoiceUniversity: string;
  secondChoiceUniversity: string;
  thirdChoiceUniversity: string;
}

export interface PostSubmitApplicationResponse {
  totalApplyCount: number;
  applyCount: number;
  appliedUniversities: PostSubmitApplicationResponseAppliedUniversities;
}

export type PostSubmitApplicationRequest = Record<string, never>;

export interface GetApplicantsResponseThirdChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: GetApplicantsResponseThirdChoiceItemApplicantsItem[];
}

export interface GetApplicantsResponseThirdChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface GetApplicantsResponseSecondChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: GetApplicantsResponseSecondChoiceItemApplicantsItem[];
}

export interface GetApplicantsResponseSecondChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface GetApplicantsResponseFirstChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: GetApplicantsResponseFirstChoiceItemApplicantsItem[];
}

export interface GetApplicantsResponseFirstChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface GetApplicantsResponse {
  firstChoice: GetApplicantsResponseFirstChoiceItem[];
  secondChoice: GetApplicantsResponseSecondChoiceItem[];
  thirdChoice: GetApplicantsResponseThirdChoiceItem[];
}

export const applicationsApi = {
  getCompetitors: async (params: { params?: Record<string, unknown> }): Promise<GetCompetitorsResponse> => {
    const res = await axiosInstance.request<GetCompetitorsResponse>({
      url: `/applications/competitors`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  postSubmitApplication: async (params: { data?: PostSubmitApplicationRequest }): Promise<PostSubmitApplicationResponse> => {
    const res = await axiosInstance.request<PostSubmitApplicationResponse>({
      url: `/applications`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  getApplicants: async (params: { params?: Record<string, unknown> }): Promise<GetApplicantsResponse> => {
    const res = await axiosInstance.request<GetApplicantsResponse>({
      url: `/applications`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

};