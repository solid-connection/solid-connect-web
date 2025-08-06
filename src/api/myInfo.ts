import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { MyInfo, MyInfoPatchRequest, MyInfoSimple } from "@/types/myInfo";
import { ListUniversity } from "@/types/university";

export const getMyInfoApi = (): Promise<AxiosResponse<MyInfo>> => axiosInstance.get("/my");

export const updateMyInfoApi = (request: MyInfoPatchRequest): Promise<AxiosResponse<MyInfoSimple>> => {
  const convertedRequest: FormData = new FormData();
  if (request.nickname) {
    convertedRequest.append("nickname", request.nickname);
  }
  if (request.file) {
    convertedRequest.append("file", request.file);
  }

  return axiosInstance.patch("/my", convertedRequest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getMyWishUniversityApi = (): Promise<AxiosResponse<ListUniversity[]>> =>
  axiosInstance.get("/univ-apply-infos/like");
