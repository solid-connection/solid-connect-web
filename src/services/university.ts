import apiClient from "@/utils/axiosClient";
import noAuthAxios from "@/libs/noAuthAxiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { College, ListCollege, UniversityFavoriteResponse } from "@/types/college";

export const getUniversityDetailDataApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<College>>> => noAuthAxios.get(`/university/detail/${universityInfoForApplyId}`);

export const getUniversityListDataApi = (): Promise<AxiosResponse<ApiResponse<ListCollege[]>>> => apiClient.get("/university/search");

export const postUniversityFavoriteApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<UniversityFavoriteResponse>>> => apiClient.post(`/university/favorite/${universityInfoForApplyId}`);
