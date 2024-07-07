import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { MyInfo, MyInfoSimple, MyWishUniversity } from "@/types/myInfo";

export const getMyInfoApi = (): Promise<AxiosResponse<ApiResponse<MyInfo>>> => {
  return axiosInstance.get("/my-page");
};

export const getMyInfoSimpleApi = (): Promise<AxiosResponse<ApiResponse<MyInfoSimple>>> => {
  return axiosInstance.get("/my-page/update");
};

export const updateMyInfoApi = (data: MyInfoSimple): Promise<AxiosResponse<ApiResponse<MyInfoSimple>>> => {
  return axiosInstance.patch("/my-page/update", data);
};

export const getMyWishUniversityApi = (): Promise<AxiosResponse<ApiResponse<MyWishUniversity>>> => {
  return axiosInstance.get("/my-page/wish-university");
};
