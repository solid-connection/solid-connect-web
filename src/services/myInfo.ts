import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { MyInfo, MyInfoSimple, MyNickname, MyProfileImage } from "@/types/myInfo";
import { ListUniversity } from "@/types/university";

export const getMyInfoApi = (): Promise<AxiosResponse<MyInfo>> => axiosInstance.get("/my-page");

export const getMyInfoSimpleApi = (): Promise<AxiosResponse<MyInfoSimple>> => axiosInstance.get("/my-page/update");

export const updateMyInfoApi = (data: MyInfoSimple): Promise<AxiosResponse<MyInfoSimple>> =>
  // DEPRECATED: Use updateMyNicknameApi and updateMyProfileImage instead
  axiosInstance.patch("/my-page/update", data);

export const getMyWishUniversityApi = (): Promise<AxiosResponse<ListUniversity[]>> =>
  axiosInstance.get("/university/like");

export const updateMyNicknameApi = (nickname: string): Promise<AxiosResponse<MyNickname>> =>
  axiosInstance.patch("/my-page/update/nickname", { nickname });

export const updateMyProfileImage = (file: File): Promise<AxiosResponse<MyProfileImage>> =>
  axiosInstance.patch("/my-page/update/profileImage", { file }, { headers: { "Content-Type": "multipart/form-data" } });
