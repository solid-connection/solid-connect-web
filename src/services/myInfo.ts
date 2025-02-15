import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { MyInfo, MyInfoSimple, MyNickname, MyProfileImage } from "@/types/myInfo";
import { ListUniversity } from "@/types/university";

export const getMyInfoApi = (): Promise<AxiosResponse<MyInfo>> => axiosInstance.get("/my");

export const getMyInfoSimpleApi = (): Promise<AxiosResponse<MyInfoSimple>> => axiosInstance.get("/my/update");

export const updateMyInfoApi = (data: MyInfoSimple): Promise<AxiosResponse<MyInfoSimple>> =>
  axiosInstance.patch("/my/update", data);

export const getMyWishUniversityApi = (): Promise<AxiosResponse<ListUniversity[]>> =>
  axiosInstance.get("/university/like");

export const updateMyNicknameApi = (nickname: string): Promise<AxiosResponse<MyNickname>> =>
  // DEPRECATED: Use updateMyInfoApi instead
  axiosInstance.patch("/my/update/nickname", { nickname });

export const updateMyProfileImage = (file: File): Promise<AxiosResponse<MyProfileImage>> =>
  // DEPRECATED: Use updateMyInfoApi instead
  axiosInstance.patch("/my/update/profileImage", { file }, { headers: { "Content-Type": "multipart/form-data" } });
