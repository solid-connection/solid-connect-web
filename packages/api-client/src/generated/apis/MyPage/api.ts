import { axiosInstance } from "../../../runtime/axiosInstance";

export type PatchInterestedRegionCountryResponse = void;

export type PatchInterestedRegionCountryRequest = Record<string, never>;

export type PatchProfileResponse = Record<string, never>;

export type PatchProfileRequest = Record<string, never>;

export interface GetProfileResponse {
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

export type PatchPasswordResponse = void;

export type PatchPasswordRequest = Record<string, never>;

export const myPageApi = {
  patchInterestedRegionCountry: async (params: { data?: PatchInterestedRegionCountryRequest }): Promise<PatchInterestedRegionCountryResponse> => {
    const res = await axiosInstance.patch<PatchInterestedRegionCountryResponse>(
      `/my/interested-location`, params?.data
    );
    return res.data;
  },

  patchProfile: async (params: { data?: PatchProfileRequest }): Promise<PatchProfileResponse> => {
    const res = await axiosInstance.patch<PatchProfileResponse>(
      `/my`, params?.data
    );
    return res.data;
  },

  getProfile: async (params: { params?: Record<string, unknown> }): Promise<GetProfileResponse> => {
    const res = await axiosInstance.get<GetProfileResponse>(
      `/my`, { params: params?.params }
    );
    return res.data;
  },

  patchPassword: async (params: { data?: PatchPasswordRequest }): Promise<PatchPasswordResponse> => {
    const res = await axiosInstance.patch<PatchPasswordResponse>(
      `/my/password`, params?.data
    );
    return res.data;
  },

};