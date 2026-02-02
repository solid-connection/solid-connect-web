import { axiosInstance } from "@/utils/axiosInstance";

export interface CompetitorsResponseThirdChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: CompetitorsResponseThirdChoiceItemApplicantsItem[];
}

export interface CompetitorsResponseThirdChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface CompetitorsResponseSecondChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: CompetitorsResponseSecondChoiceItemApplicantsItem[];
}

export interface CompetitorsResponseSecondChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface CompetitorsResponseFirstChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: CompetitorsResponseFirstChoiceItemApplicantsItem[];
}

export interface CompetitorsResponseFirstChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface CompetitorsResponse {
  firstChoice: CompetitorsResponseFirstChoiceItem[];
  secondChoice: CompetitorsResponseSecondChoiceItem[];
  thirdChoice: CompetitorsResponseThirdChoiceItem[];
}

export interface SubmitApplicationResponseAppliedUniversities {
  firstChoiceUniversity: string;
  secondChoiceUniversity: string;
  thirdChoiceUniversity: string;
}

export interface SubmitApplicationResponse {
  totalApplyCount: number;
  applyCount: number;
  appliedUniversities: SubmitApplicationResponseAppliedUniversities;
}

export type SubmitApplicationRequest = Record<string, never>;

export interface ApplicantsResponseThirdChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: ApplicantsResponseThirdChoiceItemApplicantsItem[];
}

export interface ApplicantsResponseThirdChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface ApplicantsResponseSecondChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: ApplicantsResponseSecondChoiceItemApplicantsItem[];
}

export interface ApplicantsResponseSecondChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface ApplicantsResponseFirstChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: ApplicantsResponseFirstChoiceItemApplicantsItem[];
}

export interface ApplicantsResponseFirstChoiceItemApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface ApplicantsResponse {
  firstChoice: ApplicantsResponseFirstChoiceItem[];
  secondChoice: ApplicantsResponseSecondChoiceItem[];
  thirdChoice: ApplicantsResponseThirdChoiceItem[];
}

export const applicationsApi = {
  getCompetitors: async (params: { params?: Record<string, unknown> }): Promise<CompetitorsResponse> => {
    const res = await axiosInstance.get<CompetitorsResponse>(
      `/applications/competitors`, { params: params?.params }
    );
    return res.data;
  },

  postSubmitApplication: async (params: { data?: SubmitApplicationRequest }): Promise<SubmitApplicationResponse> => {
    const res = await axiosInstance.post<SubmitApplicationResponse>(
      `/applications`, params?.data
    );
    return res.data;
  },

  getApplicants: async (params: { params?: Record<string, unknown> }): Promise<ApplicantsResponse> => {
    const res = await axiosInstance.get<ApplicantsResponse>(
      `/applications`, { params: params?.params }
    );
    return res.data;
  },

};