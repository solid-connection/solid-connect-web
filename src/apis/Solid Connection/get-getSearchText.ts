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

export interface GetSearchTextResponse {
  univApplyInfoPreviews: UnivApplyInfoPreviewsItem[];
}

const getSearchText = async (params: { params?: Record<string, any> }): Promise<GetSearchTextResponse> => {
  const res = await axiosInstance.get<GetSearchTextResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetSearchText = (params?: Record<string, any>) => {
  return useQuery<GetSearchTextResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getSearchText, params],
    queryFn: () => getSearchText({ params }),
  });
};

export default useGetSearchText;