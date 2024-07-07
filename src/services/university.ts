import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { College, ListCollege, UniversityFavoriteResponse } from "@/types/college";

export const getUniversityDetailDataApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<College>>> => publicAxiosInstance.get(`/university/detail/${universityInfoForApplyId}`);

export const getUniversityListDataApi = (): Promise<AxiosResponse<ApiResponse<ListCollege[]>>> => axiosInstance.get("/university/search");

export const postUniversityFavoriteApi = (universityInfoForApplyId: number): Promise<AxiosResponse<ApiResponse<UniversityFavoriteResponse>>> => axiosInstance.post(`/university/favorite/${universityInfoForApplyId}`);
