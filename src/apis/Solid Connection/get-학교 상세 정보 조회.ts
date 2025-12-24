import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface LanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface 학교 상세 정보 조회Response {
  id: number;
  term: string;
  koreanName: string;
  englishName: string;
  formatName: string;
  region: string;
  country: string;
  homepageUrl: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  detailsForLocal: string;
  studentCapacity: number;
  tuitionFeeType: string;
  semesterAvailableForDispatch: string;
  languageRequirements: LanguageRequirementsItem[];
  detailsForLanguage: string;
  gpaRequirement: string;
  gpaRequirementCriteria: string;
  semesterRequirement: string;
  detailsForApply: null;
  detailsForMajor: string;
  detailsForAccommodation: null;
  detailsForEnglishCourse: null;
  details: string;
  accommodationUrl: string;
  englishCourseUrl: string;
}

const 학교 상세 정보 조회 = async (params: { params?: Record<string, any> }): Promise<학교 상세 정보 조회Response> => {
  const res = await axiosInstance.get<학교 상세 정보 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use학교 상세 정보 조회 = (params?: Record<string, any>) => {
  return useQuery<학교 상세 정보 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.학교 상세 정보 조회, params],
    queryFn: () => 학교 상세 정보 조회({ params }),
  });
};

export default use학교 상세 정보 조회;