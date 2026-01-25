import type { AxiosResponse } from "axios";
import type { UserRole } from "@/types/mentor";
import type { BaseUserInfo } from "@/types/myInfo";
import { axiosInstance } from "@/utils/axiosInstance";

// --- 타입 정의 ---
export interface MenteeInfo extends BaseUserInfo {
  role: UserRole.MENTEE;
  interestedCountries: string[];
}

export interface MentorInfo extends BaseUserInfo {
  role: UserRole.MENTOR;
  attendedUniversity: string;
}

export interface AdminInfo extends BaseUserInfo {
  role: UserRole.ADMIN;
  attendedUniversity: string;
}

export type MyInfoResponse = MenteeInfo | MentorInfo | AdminInfo;

export type InterestedRegionCountryResponse = undefined;

export type InterestedRegionCountryRequest = string[];

export interface ProfilePatchRequest {
  nickname?: string;
  file?: File;
}

export interface PasswordPatchRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export const myPageApi = {
  getProfile: async (): Promise<MyInfoResponse> => {
    const response: AxiosResponse<MyInfoResponse> = await axiosInstance.get("/my");
    return response.data;
  },

  patchProfile: async (data: ProfilePatchRequest): Promise<void> => {
    const formData = new FormData();
    if (data.nickname) {
      formData.append("nickname", data.nickname);
    }
    if (data.file) {
      formData.append("file", data.file);
    }
    const res = await axiosInstance.patch<void>("/my", formData);
    return res.data;
  },

  patchPassword: async (data: PasswordPatchRequest): Promise<void> => {
    const res = await axiosInstance.patch<void>("/my/password", data);
    return res.data;
  },

  patchInterestedRegionCountry: async (
    data: InterestedRegionCountryRequest,
  ): Promise<InterestedRegionCountryResponse> => {
    const res = await axiosInstance.patch<InterestedRegionCountryResponse>(`/my/interested-location`, data);
    return res.data;
  },
};
