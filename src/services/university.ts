import apiClient from "@/lib/axiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { College, ListCollege, UniversityFavoriteResponse } from "@/types/college";

export const getUniversityDetailDataApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<College>>> => apiClient.get(`/university/detail/${universityInfoForApplyId}`);

export const getUniversityListDataApi = (): Promise<AxiosResponse<ApiResponse<ListCollege[]>>> => apiClient.get("/university/list");

export const postUniversityFavoriteApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<UniversityFavoriteResponse>>> => apiClient.post(`/university/favorite/${universityInfoForApplyId}`);
