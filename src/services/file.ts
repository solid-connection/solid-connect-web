import apiClient from "@/utils/axiosClient";
import noAuthAxios from "@/libs/noAuthAxiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { FileResponse } from "@/types/file";

export const uploadProfileImageFileUnauthorizedApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => noAuthAxios.post("/file/profile/pre", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uplaodProfileImageFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => apiClient.post("/file/profile/post", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadGpaFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => apiClient.post("/file/gpa", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadLanguageTestFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => apiClient.post("/file/language-test", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });
