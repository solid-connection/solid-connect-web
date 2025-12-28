import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { NicknameExistsResponse, usersApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetNicknameExists = (params?: Record<string, any>) => {
  return useQuery<NicknameExistsResponse, AxiosError>({
    queryKey: [QueryKeys.users.nicknameExists, params],
    queryFn: () => usersApi.getNicknameExists(params ? { params } : {}),
  });
};

export default useGetNicknameExists;
