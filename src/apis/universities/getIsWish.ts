import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { IsWishResponse, universitiesApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetIsWish = (univApplyInfoId: string | number, params?: Record<string, any>) => {
  return useQuery<IsWishResponse, AxiosError>({
    queryKey: [QueryKeys.universities.isWish, univApplyInfoId, params],
    queryFn: () => universitiesApi.getIsWish({ univApplyInfoId, params }),
    enabled: !!univApplyInfoId,
  });
};

export default useGetIsWish;
