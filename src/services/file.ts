import { axiosInstance, publicAxiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { FileResponse } from "@/types/file";

export const uploadProfileImageFileUnauthorizedApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => publicAxiosInstance.post("/file/profile/pre", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uplaodProfileImageFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => axiosInstance.post("/file/profile/post", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadGpaFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => axiosInstance.post("/file/gpa", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadLanguageTestFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => axiosInstance.post("/file/language-test", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });
