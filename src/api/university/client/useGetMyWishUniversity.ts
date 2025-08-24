import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { ListUniversity } from "@/types/university";

import { useQuery } from "@tanstack/react-query";

export const getMyWishUniversity = (): Promise<AxiosResponse<ListUniversity[]>> =>
  axiosInstance.get("/univ-apply-infos/like");

const useGetMyWishUniversity = () => {
  return useQuery({
    queryKey: [QueryKeys.univApplyInfosLike],
    queryFn: () => getMyWishUniversity(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });

  return;
};

export default useGetMyWishUniversity;
