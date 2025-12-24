import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ThirdChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: ApplicantsItem[];
}

export interface ApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface SecondChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: ApplicantsItem[];
}

export interface ApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface FirstChoiceItem {
  koreanName: string;
  studentCapacity: number;
  region: string;
  country: string;
  applicants: ApplicantsItem[];
}

export interface ApplicantsItem {
  nicknameForApply: string;
  gpa: number;
  testType: string;
  testScore: string;
  isMine: boolean;
}

export interface GetApplicantsResponse {
  firstChoice: FirstChoiceItem[];
  secondChoice: SecondChoiceItem[];
  thirdChoice: ThirdChoiceItem[];
}

const getApplicants = async (params: { params?: Record<string, any> }): Promise<GetApplicantsResponse> => {
  const res = await axiosInstance.get<GetApplicantsResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetApplicants = (params?: Record<string, any>) => {
  return useQuery<GetApplicantsResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getApplicants, params],
    queryFn: () => getApplicants({ params }),
  });
};

export default useGetApplicants;