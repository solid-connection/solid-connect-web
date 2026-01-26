import { axiosInstance } from "@/utils/axiosInstance";

export interface NicknameExistsResponse {
  exists: boolean;
}

export type BlockUserResponse = void;

export type BlockUserRequest = Record<string, never>;

export type UnblockUserResponse = void;

export interface BlockedUsersResponseContentItem {
  id: number;
  blockedId: number;
  nickname: string;
  createdAt: string;
}

export interface BlockedUsersResponse {
  content: BlockedUsersResponseContentItem[];
  nextPageNumber: number;
}

export const usersApi = {
  getNicknameExists: async (params: { params?: Record<string, any> }): Promise<NicknameExistsResponse> => {
    const res = await axiosInstance.get<NicknameExistsResponse>(
      `/users/exists?nickname=abc`, { params: params?.params }
    );
    return res.data;
  },

  postBlockUser: async (params: { blockedId: string | number, data?: BlockUserRequest }): Promise<BlockUserResponse> => {
    const res = await axiosInstance.post<BlockUserResponse>(
      `/users/block/${params.blockedId}`, params?.data
    );
    return res.data;
  },

  deleteUnblockUser: async (params: { blockedId: string | number }): Promise<UnblockUserResponse> => {
    const res = await axiosInstance.delete<UnblockUserResponse>(
      `/users/block/${params.blockedId}`
    );
    return res.data;
  },

  getBlockedUsers: async (params: { params?: Record<string, any> }): Promise<BlockedUsersResponse> => {
    const res = await axiosInstance.get<BlockedUsersResponse>(
      `/users/blocks`, { params: params?.params }
    );
    return res.data;
  },

};