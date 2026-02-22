import { axiosInstance } from "../../../runtime/axiosInstance";

export type GetKakaoUserIdsResponse = void;

export type PostKakaoUnlinkResponse = void;

export type PostKakaoUnlinkRequest = Record<string, never>;

export type GetKakaoInfoResponse = void;

export const kakaoApiApi = {
  getKakaoUserIds: async (params: { params?: Record<string, unknown> }): Promise<GetKakaoUserIdsResponse> => {
    const res = await axiosInstance.request<GetKakaoUserIdsResponse>({
      url: `https://kapi.kakao.com/v1/user/ids`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  postKakaoUnlink: async (params: { params?: Record<string, unknown>, data?: PostKakaoUnlinkRequest }): Promise<PostKakaoUnlinkResponse> => {
    const res = await axiosInstance.request<PostKakaoUnlinkResponse>({
      url: `https://kapi.kakao.com/v1/user/unlink`,
      method: "POST",
      params: params?.params,
      data: params?.data,
    });
    return res.data;
  },

  getKakaoInfo: async (params: { params?: Record<string, unknown> }): Promise<GetKakaoInfoResponse> => {
    const res = await axiosInstance.request<GetKakaoInfoResponse>({
      url: `https://kapi.kakao.com/v2/user/me`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

};