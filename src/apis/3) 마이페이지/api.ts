import { axiosInstance } from "@/utils/axiosInstance";

export type 관심 권역국가 변경Response = void;

export type 관심 권역국가 변경Request = Record<string, never>;

export type 내 정보 수정Response = void;

export type 내 정보 수정Request = Record<string, never>;

export interface 내 정보 조회Response {
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

export type 비밀번호 변경Response = void;

export type 비밀번호 변경Request = Record<string, never>;

export const 3) 마이페이지Api = {
  patch관심 권역국가 변경: async (params: { data?: 관심 권역국가 변경Request }): Promise<관심 권역국가 변경Response> => {
    const res = await axiosInstance.patch<관심 권역국가 변경Response>(
      `/my/interested-location`, params?.data
    );
    return res.data;
  },

  patch내 정보 수정: async (params: { data?: 내 정보 수정Request }): Promise<내 정보 수정Response> => {
    const res = await axiosInstance.patch<내 정보 수정Response>(
      `/my`, params?.data
    );
    return res.data;
  },

  get내 정보 조회: async (params: { params?: Record<string, any> }): Promise<내 정보 조회Response> => {
    const res = await axiosInstance.get<내 정보 조회Response>(
      `/my`, { params: params?.params }
    );
    return res.data;
  },

  patch비밀번호 변경: async (params: { data?: 비밀번호 변경Request }): Promise<비밀번호 변경Response> => {
    const res = await axiosInstance.patch<비밀번호 변경Response>(
      `/my/password`, params?.data
    );
    return res.data;
  },

};