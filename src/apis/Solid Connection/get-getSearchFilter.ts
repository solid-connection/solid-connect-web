import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface UnivApplyInfoPreviewsItem {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: LanguageRequirementsItem[];
}

export interface LanguageRequirementsItem {
  languageTestType: string;
  minScore: string;
}

export interface GetSearchFilterResponse {
  univApplyInfoPreviews: UnivApplyInfoPreviewsItem[];
}

const getSearchFilter = async (params: { params?: Record<string, any> }): Promise<GetSearchFilterResponse> => {
  const res = await axiosInstance.get<GetSearchFilterResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetSearchFilter = (params?: Record<string, any>) => {
  return useQuery<GetSearchFilterResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getSearchFilter, params],
    queryFn: () => getSearchFilter({ params }),
  });
};

export default useGetSearchFilter;