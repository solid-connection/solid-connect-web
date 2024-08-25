import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { MyInfo, MyInfoSimple, MyNickname, MyProfileImage } from "@/types/myInfo";
import { ListUniversity } from "@/types/university";

export const getMyInfoApi = (): Promise<AxiosResponse<MyInfo>> => {
  return axiosInstance.get("/my-page");
};

export const getMyInfoSimpleApi = (): Promise<AxiosResponse<MyInfoSimple>> => {
  return axiosInstance.get("/my-page/update");
};

export const updateMyInfoApi = (data: MyInfoSimple): Promise<AxiosResponse<MyInfoSimple>> => {
  // DEPRECATED: Use updateMyNicknameApi and updateMyProfileImage instead
  return axiosInstance.patch("/my-page/update", data);
};

export const getMyWishUniversityApi = (): Promise<AxiosResponse<ListUniversity[]>> => {
  return axiosInstance.get("/university/like");
};

export const updateMyNicknameApi = (nickname: string): Promise<AxiosResponse<MyNickname>> => {
  return axiosInstance.patch("/my-page/update/nickname", { nickname: nickname });
};

export const updateMyProfileImage = (file: File): Promise<AxiosResponse<MyProfileImage>> => {
  return axiosInstance.patch(
    "/my-page/update/profileImage",
    { file: file },
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};
