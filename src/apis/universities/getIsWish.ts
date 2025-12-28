import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, IsWishResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetIsWish = (univApplyInfoId: string | number, params?: Record<string, any>) => {
  return useQuery<IsWishResponse, AxiosError>({
    queryKey: [QueryKeys.universities.isWish, univApplyInfoId, params],
    queryFn: () => universitiesApi.getIsWish({ univApplyInfoId, params }),
    enabled: !!univApplyInfoId,
  });
};

export default useGetIsWish;