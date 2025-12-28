import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { BlockedUsersResponse, usersApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetBlockedUsers = (params?: Record<string, any>) => {
  return useQuery<BlockedUsersResponse, AxiosError>({
    queryKey: [QueryKeys.users.blockedUsers, params],
    queryFn: () => usersApi.getBlockedUsers(params ? { params } : {}),
  });
};

export default useGetBlockedUsers;
