import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetWishListResponseItem {
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

export interface GetWishListResponse {
  0: 0;
  1: 1;
}

const getWishList = async (params: { params?: Record<string, any> }): Promise<GetWishListResponse> => {
  const res = await axiosInstance.get<GetWishListResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetWishList = (params?: Record<string, any>) => {
  return useQuery<GetWishListResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getWishList, params],
    queryFn: () => getWishList({ params }),
  });
};

export default useGetWishList;