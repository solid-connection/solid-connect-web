import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

const deleteUniversityFavorite = (universityInfoForApplyId: number): Promise<AxiosResponse> =>
  axiosInstance.delete(`/univ-apply-infos/${universityInfoForApplyId}/like`);

const useDeleteUniversityFavorite = () => {
  return useMutation({
    mutationFn: deleteUniversityFavorite,
  });
};

export default useDeleteUniversityFavorite;
