import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

const deleteUniversityFavorite = (universityInfoForApplyId: number): Promise<AxiosResponse> =>
  axiosInstance.delete(`/univ-apply-infos/${universityInfoForApplyId}/like`);

const useDeleteUniversityFavorite = () => {
  return useMutation({
    mutationFn: deleteUniversityFavorite,

    onError: (error) => {
      alert("관심학교 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default useDeleteUniversityFavorite;
