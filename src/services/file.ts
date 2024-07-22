import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { FileResponse } from "@/types/file";

export const uploadProfileImageFilePublicApi = (file: File): Promise<AxiosResponse<FileResponse>> => {
  return publicAxiosInstance.post(
    "/file/profile/pre",
    { file: file },
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};

export const uplaodProfileImageFileApi = (file: File): Promise<AxiosResponse<FileResponse>> => {
  return axiosInstance.post(
    "/file/profile/post",
    { file: file },
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};

export const uploadGpaFileApi = (file: File): Promise<AxiosResponse<FileResponse>> => {
  return axiosInstance.post("/file/gpa", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });
};

export const uploadLanguageTestFileApi = (file: File): Promise<AxiosResponse<FileResponse>> => {
  return axiosInstance.post(
    "/file/language-test",
    { file: file },
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};
