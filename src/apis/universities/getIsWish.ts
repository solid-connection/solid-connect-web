import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type IsWishResponse, universitiesApi } from "./api";

const useGetIsWish = (univApplyInfoId: string | number, params?: Record<string, any>) => {
  return useQuery<IsWishResponse, AxiosError>({
    queryKey: [QueryKeys.universities.isWish, univApplyInfoId, params],
    queryFn: () => universitiesApi.getIsWish({ univApplyInfoId, params }),
    enabled: !!univApplyInfoId,
  });
};

export default useGetIsWish;
