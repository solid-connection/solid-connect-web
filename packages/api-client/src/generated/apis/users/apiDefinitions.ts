import type { DeleteUnblockUserResponse, GetBlockedUsersResponse, GetNicknameExistsResponse, PostBlockUserResponse } from './api';

export const usersApiDefinitions = {
  getNicknameExists: {
    method: 'GET' as const,
    path: '/users/exists' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetNicknameExistsResponse,
  },
  postBlockUser: {
    method: 'POST' as const,
    path: '/users/block/{{blocked-id}}' as const,
    pathParams: undefined as unknown as { blockedId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as PostBlockUserResponse,
  },
  deleteUnblockUser: {
    method: 'DELETE' as const,
    path: '/users/block/{{blocked-id}}' as const,
    pathParams: undefined as unknown as { blockedId: string | number },
    queryParams: undefined as unknown as Record<string, never>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as DeleteUnblockUserResponse,
  },
  getBlockedUsers: {
    method: 'GET' as const,
    path: '/users/blocks' as const,
    pathParams: undefined as unknown as Record<string, never>,
    queryParams: undefined as unknown as Record<string, unknown>,
    body: undefined as unknown as Record<string, never>,
    response: undefined as unknown as GetBlockedUsersResponse,
  },
} as const;

export type UsersApiDefinitions = typeof usersApiDefinitions;