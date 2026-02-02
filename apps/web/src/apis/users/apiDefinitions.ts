import type { BlockUserResponse, BlockedUsersResponse, NicknameExistsResponse, UnblockUserResponse } from './api';

export const usersApiDefinitions = {
  getNicknameExists: {
    method: 'GET' as const,
    path: '{{URL}}/users/exists?nickname=abc' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as NicknameExistsResponse,
  },
  postBlockUser: {
    method: 'POST' as const,
    path: '{{URL}}/users/block/{{blocked-id}}' as const,
    pathParams: {} as { blockedId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as BlockUserResponse,
  },
  deleteUnblockUser: {
    method: 'DELETE' as const,
    path: '{{URL}}/users/block/{{blocked-id}}' as const,
    pathParams: {} as { blockedId: string | number },
    queryParams: {} as Record<string, never>,
    body: {} as Record<string, never>,
    response: {} as UnblockUserResponse,
  },
  getBlockedUsers: {
    method: 'GET' as const,
    path: '{{URL}}/users/blocks' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as BlockedUsersResponse,
  },
} as const;

export type UsersApiDefinitions = typeof usersApiDefinitions;