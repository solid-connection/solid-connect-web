import apiClient from "@/utils/axiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { MyInfo, MyInfoSimple, MyWishUniversity } from "@/types/myInfo";

export const getMyInfoApi = (): Promise<AxiosResponse<ApiResponse<MyInfo>>> => apiClient.get("/my-page");

export const getMyInfoSimpleApi = (): Promise<AxiosResponse<ApiResponse<MyInfoSimple>>> => apiClient.get("/my-page/update");

export const updateMyInfoApi = (data: MyInfoSimple): Promise<AxiosResponse<ApiResponse<MyInfoSimple>>> => apiClient.patch("/my-page/update", data);

export const getMyWishUniversityApi = (): Promise<AxiosResponse<ApiResponse<MyWishUniversity>>> => apiClient.get("/my-page/wish-university");
