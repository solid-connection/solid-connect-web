import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteUniversityFavorite = (universityInfoForApplyId: number): Promise<AxiosResponse> =>
  axiosInstance.delete(`/univ-apply-infos/${universityInfoForApplyId}/like`);

const useDeleteUniversityFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUniversityFavorite,
    onSuccess: () => {
      // 위시리스트 관련 쿼리를 무효화하여 데이터를 다시 불러옵니다.
      queryClient.invalidateQueries({ queryKey: [QueryKeys.univApplyInfosLike] });
    },
  });
};

export default useDeleteUniversityFavorite;
