import { AxiosResponse } from "axios";

import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";

import { FileResponse } from "@/types/file";

export const uploadProfileImageFilePublicApi = (file: File): Promise<AxiosResponse<FileResponse>> =>
  publicAxiosInstance.post("/file/profile/pre", { file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uplaodProfileImageFileApi = (file: File): Promise<AxiosResponse<FileResponse>> =>
  axiosInstance.post("/file/profile/post", { file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadGpaFileApi = (file: File): Promise<AxiosResponse<FileResponse>> =>
  axiosInstance.post("/file/gpa", { file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadLanguageTestFileApi = (file: File): Promise<AxiosResponse<FileResponse>> =>
  axiosInstance.post("/file/language-test", { file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadMentorVerificationFileApi = (file: File): Promise<AxiosResponse<FileResponse>> =>
  axiosInstance.post("/file/mentor-verification", { file }, { headers: { "Content-Type": "multipart/form-data" } });
