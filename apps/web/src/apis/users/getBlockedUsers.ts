import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type BlockedUsersResponse, usersApi } from "./api";

const useGetBlockedUsers = (params?: Record<string, any>) => {
  return useQuery<BlockedUsersResponse, AxiosError>({
    queryKey: [QueryKeys.users.blockedUsers, params],
    queryFn: () => usersApi.getBlockedUsers(params ? { params } : {}),
  });
};

export default useGetBlockedUsers;
