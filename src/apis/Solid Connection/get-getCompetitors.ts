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

export interface GetCompetitorsResponse {
  firstChoice: FirstChoiceItem[];
  secondChoice: SecondChoiceItem[];
  thirdChoice: ThirdChoiceItem[];
}

const getCompetitors = async (params: { params?: Record<string, any> }): Promise<GetCompetitorsResponse> => {
  const res = await axiosInstance.get<GetCompetitorsResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetCompetitors = (params?: Record<string, any>) => {
  return useQuery<GetCompetitorsResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getCompetitors, params],
    queryFn: () => getCompetitors({ params }),
  });
};

export default useGetCompetitors;