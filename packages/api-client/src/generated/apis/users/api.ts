import { axiosInstance } from "../../../runtime/axiosInstance";

export interface GetNicknameExistsResponse {
  exists: boolean;
}

export type PostBlockUserResponse = void;

export type PostBlockUserRequest = Record<string, never>;

export type DeleteUnblockUserResponse = void;

export interface GetBlockedUsersResponseContentItem {
  id: number;
  blockedId: number;
  nickname: string;
  createdAt: string;
}

export interface GetBlockedUsersResponse {
  content: GetBlockedUsersResponseContentItem[];
  nextPageNumber: number;
}

export const usersApi = {
  getNicknameExists: async (params: { params?: Record<string, unknown> }): Promise<GetNicknameExistsResponse> => {
    const res = await axiosInstance.get<GetNicknameExistsResponse>(
      `/users/exists`, { params: params?.params }
    );
    return res.data;
  },

  postBlockUser: async (params: { blockedId: string | number, data?: PostBlockUserRequest }): Promise<PostBlockUserResponse> => {
    const res = await axiosInstance.post<PostBlockUserResponse>(
      `/users/block/${params.blockedId}`, params?.data
    );
    return res.data;
  },

  deleteUnblockUser: async (params: { blockedId: string | number }): Promise<DeleteUnblockUserResponse> => {
    const res = await axiosInstance.delete<DeleteUnblockUserResponse>(
      `/users/block/${params.blockedId}`
    );
    return res.data;
  },

  getBlockedUsers: async (params: { params?: Record<string, unknown> }): Promise<GetBlockedUsersResponse> => {
    const res = await axiosInstance.get<GetBlockedUsersResponse>(
      `/users/blocks`, { params: params?.params }
    );
    return res.data;
  },

};