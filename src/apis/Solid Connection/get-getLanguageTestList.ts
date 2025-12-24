import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  languageTestScoreStatusResponse: LanguageTestScoreStatusResponse;
  siteUserResponse: SiteUserResponse;
}

export interface GetLanguageTestListResponse {
  content: ContentItem[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

const getLanguageTestList = async (params: { params?: Record<string, any> }): Promise<GetLanguageTestListResponse> => {
  const res = await axiosInstance.get<GetLanguageTestListResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetLanguageTestList = (params?: Record<string, any>) => {
  return useQuery<GetLanguageTestListResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getLanguageTestList, params],
    queryFn: () => getLanguageTestList({ params }),
  });
};

export default useGetLanguageTestList;