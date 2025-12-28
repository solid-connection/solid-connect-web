import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { usersApi, BlockedUsersResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetBlockedUsers = (params?: Record<string, any>) => {
  return useQuery<BlockedUsersResponse, AxiosError>({
    queryKey: [QueryKeys.users.blockedUsers, params],
    queryFn: () => usersApi.getBlockedUsers(params ? { params } : {}),
  });
};

export default useGetBlockedUsers;