import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { usersApi, NicknameExistsResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetNicknameExists = (params?: Record<string, any>) => {
  return useQuery<NicknameExistsResponse, AxiosError>({
    queryKey: [QueryKeys.users.nicknameExists, params],
    queryFn: () => usersApi.getNicknameExists(params ? { params } : {}),
  });
};

export default useGetNicknameExists;