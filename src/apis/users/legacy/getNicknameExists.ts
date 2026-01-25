import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type NicknameExistsResponse, usersApi } from "./api";

const useGetNicknameExists = (params?: Record<string, any>) => {
  return useQuery<NicknameExistsResponse, AxiosError>({
    queryKey: [QueryKeys.users.nicknameExists, params],
    queryFn: () => usersApi.getNicknameExists(params ? { params } : {}),
  });
};

export default useGetNicknameExists;
