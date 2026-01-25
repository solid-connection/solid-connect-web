import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ListUniversity } from "@/types/university";
import { QueryKeys } from "../queryKeys";
import { universitiesApi, type WishListResponse } from "./api";

/**
 * @description 내 위시리스트 대학 목록 조회를 위한 useQuery 커스텀 훅
 * @param enabled - 쿼리 활성화 여부
 */
const useGetWishList = (enabled: boolean = true) => {
  return useQuery<WishListResponse, AxiosError, ListUniversity[]>({
    queryKey: [QueryKeys.universities.wishList],
    queryFn: () => universitiesApi.getWishList({}),
    staleTime: 1000 * 60 * 5,
    select: (data) => data as unknown as ListUniversity[],
    enabled,
  });
};

export default useGetWishList;
