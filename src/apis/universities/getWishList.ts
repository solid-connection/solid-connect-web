import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, WishListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetWishList = (params?: Record<string, any>) => {
  return useQuery<WishListResponse, AxiosError>({
    queryKey: [QueryKeys.universities.wishList, params],
    queryFn: () => universitiesApi.getWishList(params ? { params } : {}),
  });
};

export default useGetWishList;