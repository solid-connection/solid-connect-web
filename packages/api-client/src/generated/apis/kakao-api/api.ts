import { axiosInstance } from "../../../runtime/axiosInstance";

export type GetKakaoUserIdsResponse = void;

export type PostKakaoUnlinkResponse = void;

export type PostKakaoUnlinkRequest = Record<string, never>;

export type GetKakaoInfoResponse = void;

export const kakaoApiApi = {
  getKakaoUserIds: async (params: { params?: Record<string, unknown> }): Promise<GetKakaoUserIdsResponse> => {
    const res = await axiosInstance.get<GetKakaoUserIdsResponse>(
      `https://kapi.kakao.com/v1/user/ids`, { params: params?.params }
    );
    return res.data;
  },

  postKakaoUnlink: async (params: { params?: Record<string, unknown>, data?: PostKakaoUnlinkRequest }): Promise<PostKakaoUnlinkResponse> => {
    const res = await axiosInstance.post<PostKakaoUnlinkResponse>(
      `https://kapi.kakao.com/v1/user/unlink`, params?.data
    );
    return res.data;
  },

  getKakaoInfo: async (params: { params?: Record<string, unknown> }): Promise<GetKakaoInfoResponse> => {
    const res = await axiosInstance.get<GetKakaoInfoResponse>(
      `https://kapi.kakao.com/v2/user/me`, { params: params?.params }
    );
    return res.data;
  },

};