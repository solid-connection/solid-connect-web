import apiClient from "@/utils/axiosClient";
import noAuthAxios from "@/utils/noAuthAxiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { College, ListCollege, UniversityFavoriteResponse } from "@/types/college";
import useFetch from "@/hooks/useFetch";

export const getUniversityDetailDataApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<College>>> => noAuthAxios.get(`/university/detail/${universityInfoForApplyId}`);

export const getUniversityListDataApi = (): Promise<AxiosResponse<ApiResponse<ListCollege[]>>> => noAuthAxios.get("/university/search");

export const postUniversityFavoriteApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<UniversityFavoriteResponse>>> => apiClient.post(`/university/favorite/${universityInfoForApplyId}`);

export const useGetUniversityDetailData = (universityInfoForApplyId: number) => {
  return useFetch<ApiResponse<College>>(`/university/detail/${universityInfoForApplyId}`, "GET");
};

export const useGetUniversityListData = () => {
  return useFetch<ApiResponse<ListCollege[]>>("/university/search");
};

export const usePostUniversityFavorite = (universityInfoForApplyId: number) => {
  return useFetch<ApiResponse<UniversityFavoriteResponse>>(`/university/favorite/${universityInfoForApplyId}`, "POST");
};
