import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { MyInfo, MyInfoSimple } from "@/types/myInfo";
import { ListUniversity } from "@/types/university";

export const getMyInfoApi = (): Promise<AxiosResponse<MyInfo>> => {
  return axiosInstance.get("/my-page");
};

export const getMyInfoSimpleApi = (): Promise<AxiosResponse<MyInfoSimple>> => {
  return axiosInstance.get("/my-page/update");
};

export const updateMyInfoApi = (data: MyInfoSimple): Promise<AxiosResponse<MyInfoSimple>> => {
  return axiosInstance.patch("/my-page/update", data);
};

export const getMyWishUniversityApi = (): Promise<AxiosResponse<ListUniversity[]>> => {
  return axiosInstance.get("/university/like");
};
