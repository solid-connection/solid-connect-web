import { axiosInstance } from "../../../runtime/axiosInstance";

export interface GetNicknameExistsResponse {
  exists: boolean;
}

export type PostBlockUserResponse = void;

export type PostBlockUserRequest = Record<string, never>;

export type DeleteUnblockUserResponse = void;

export type DeleteUnblockUserRequest = Record<string, never>;

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
    const res = await axiosInstance.request<GetNicknameExistsResponse>({
      url: `/users/exists`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

  postBlockUser: async (params: { blockedId: string | number, data?: PostBlockUserRequest }): Promise<PostBlockUserResponse> => {
    const res = await axiosInstance.request<PostBlockUserResponse>({
      url: `/users/block/${params.blockedId}`,
      method: "POST",
      data: params?.data,
    });
    return res.data;
  },

  deleteUnblockUser: async (params: { blockedId: string | number, data?: DeleteUnblockUserRequest }): Promise<DeleteUnblockUserResponse> => {
    const res = await axiosInstance.request<DeleteUnblockUserResponse>({
      url: `/users/block/${params.blockedId}`,
      method: "DELETE",
      data: params?.data,
    });
    return res.data;
  },

  getBlockedUsers: async (params: { params?: Record<string, unknown> }): Promise<GetBlockedUsersResponse> => {
    const res = await axiosInstance.request<GetBlockedUsersResponse>({
      url: `/users/blocks`,
      method: "GET",
      params: params?.params,
    });
    return res.data;
  },

};