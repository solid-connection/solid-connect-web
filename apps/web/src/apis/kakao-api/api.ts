import { axiosInstance } from "@/utils/axiosInstance";

export type KakaoUserIdsResponse = void;

export type KakaoUnlinkResponse = void;

export type KakaoUnlinkRequest = Record<string, never>;

export type KakaoInfoResponse = void;

export const kakaoApiApi = {
  getKakaoUserIds: async (params: { params?: Record<string, any> }): Promise<KakaoUserIdsResponse> => {
    const res = await axiosInstance.get<KakaoUserIdsResponse>(`https://kapi.kakao.com/v1/user/ids?order=dsc`, {
      params: params?.params,
    });
    return res.data;
  },

  postKakaoUnlink: async (params: { data?: KakaoUnlinkRequest }): Promise<KakaoUnlinkResponse> => {
    const res = await axiosInstance.post<KakaoUnlinkResponse>(
      `https://kapi.kakao.com/v1/user/unlink?target_id_type=user_id&target_id=3715136239`,
      params?.data,
    );
    return res.data;
  },

  getKakaoInfo: async (params: { params?: Record<string, any> }): Promise<KakaoInfoResponse> => {
    const res = await axiosInstance.get<KakaoInfoResponse>(
      `https://kapi.kakao.com/v2/user/me?property_keys=["kakao_account.email"]&target_id_type=user_id&target_id=3715136239`,
      { params: params?.params },
    );
    return res.data;
  },
};
