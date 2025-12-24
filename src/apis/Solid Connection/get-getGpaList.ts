import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  gpaScoreStatusResponse: GpaScoreStatusResponse;
  siteUserResponse: SiteUserResponse;
}

export interface GetGpaListResponse {
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

const getGpaList = async (params: { params?: Record<string, any> }): Promise<GetGpaListResponse> => {
  const res = await axiosInstance.get<GetGpaListResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetGpaList = (params?: Record<string, any>) => {
  return useQuery<GetGpaListResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getGpaList, params],
    queryFn: () => getGpaList({ params }),
  });
};

export default useGetGpaList;