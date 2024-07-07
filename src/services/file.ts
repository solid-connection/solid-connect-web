import apiClient from "@/utils/axiosClient";
import noAuthAxios from "@/utils/noAuthAxiosClient";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/response";
import { FileResponse } from "@/types/file";
import useFetch from "@/hooks/useFetch";

export const uploadProfileImageFileUnauthorizedApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => noAuthAxios.post("/file/profile/pre", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uplaodProfileImageFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => apiClient.post("/file/profile/post", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadGpaFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => apiClient.post("/file/gpa", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

export const uploadLanguageTestFileApi = (file: File): Promise<AxiosResponse<ApiResponse<FileResponse>>> => apiClient.post("/file/language-test", { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

// export const useUploadProfileImageFileUnauthorized = (file: File) => {
//   return useFetch<ApiResponse<FileResponse>>("/file/profile/pre", "POST", { file: file });
// };

export const useUploadProfileImageFile = (file: File) => {
  return useFetch<ApiResponse<FileResponse>>("/file/profile/post", "POST", { file: file });
};

export const useUploadGpaFile = (file: File) => {
  return useFetch<ApiResponse<FileResponse>>("/file/gpa", "POST", { file: file });
};

export const useUploadLanguageTestFile = (file: File) => {
  return useFetch<ApiResponse<FileResponse>>("/file/language-test", "POST", { file: file });
};
