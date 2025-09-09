import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";
import { createMutationErrorHandler } from "@/utils/errorHandler";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * @description 위시리스트 학교 추가 API 응답 타입
 * @property {number} universityInfoForApplyId - 추가된 학교 정보 ID
 * @property {string} message - 성공 메시지
 */
interface UniversityFavoriteResponse {
  universityInfoForApplyId: number;
  message: string;
}

/**
 * @description 위시리스트에 학교를 추가하는 API 함수
 * @param universityInfoForApplyId - 추가할 학교 정보의 ID
 * @returns Promise<AxiosResponse<UniversityFavoriteResponse>>
 */
export const postUniversityFavoriteApi = (
  universityInfoForApplyId: number,
): Promise<AxiosResponse<UniversityFavoriteResponse>> =>
  axiosInstance.post(`/univ-apply-infos/${universityInfoForApplyId}/like`);

/**
 * @description 위시리스트 학교 추가를 위한 useMutation 커스텀 훅
 */
const usePostUniversityFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutation 실행 시 호출될 함수
    mutationFn: postUniversityFavoriteApi,

    // mutation 성공 시 실행될 콜백
    onSuccess: () => {
      // 위시리스트 관련 쿼리를 무효화하여 데이터를 다시 불러옵니다.
      queryClient.invalidateQueries({ queryKey: [QueryKeys.univApplyInfosLike] });
    },

    // mutation 실패 시 실행될 콜백
    onError: createMutationErrorHandler("위시리스트 추가에 실패했습니다."),
  });
};

export default usePostUniversityFavorite;
