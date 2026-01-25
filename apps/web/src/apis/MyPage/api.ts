import { axiosInstance } from "@/utils/axiosInstance";

export type InterestedRegionCountryResponse = void;

export type InterestedRegionCountryRequest = Record<string, never>;

export type ProfileResponse = Record<string, never>;

export type ProfileRequest = Record<string, never>;

export interface ProfileResponse {
  likedUniversityCount: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  authType: string;
  email: string;
  likedPostCount: number;
  likedMentorCount: number;
  interestedCountries: string[];
}

export type PasswordResponse = void;

export type PasswordRequest = Record<string, never>;

export const myPageApi = {
  patchInterestedRegionCountry: async (params: { data?: InterestedRegionCountryRequest }): Promise<InterestedRegionCountryResponse> => {
    const res = await axiosInstance.patch<InterestedRegionCountryResponse>(
      `/my/interested-location`, params?.data
    );
    return res.data;
  },

  patchProfile: async (params: { data?: ProfileRequest }): Promise<ProfileResponse> => {
    const res = await axiosInstance.patch<ProfileResponse>(
      `/my`, params?.data
    );
    return res.data;
  },

  getProfile: async (params: { params?: Record<string, any> }): Promise<ProfileResponse> => {
    const res = await axiosInstance.get<ProfileResponse>(
      `/my`, { params: params?.params }
    );
    return res.data;
  },

  patchPassword: async (params: { data?: PasswordRequest }): Promise<PasswordResponse> => {
    const res = await axiosInstance.patch<PasswordResponse>(
      `/my/password`, params?.data
    );
    return res.data;
  },

};