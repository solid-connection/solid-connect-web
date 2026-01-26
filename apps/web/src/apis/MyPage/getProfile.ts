import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { myPageApi, ProfileResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetProfile = (params?: Record<string, any>) => {
  return useQuery<ProfileResponse, AxiosError>({
    queryKey: [QueryKeys.MyPage.profile, params],
    queryFn: () => myPageApi.getProfile(params ? { params } : {}),
  });
};

export default useGetProfile;