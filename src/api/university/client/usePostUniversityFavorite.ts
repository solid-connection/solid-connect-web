import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

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
      // ['favorites'], ['univ-apply-infos', 'like'] 등 구체적인 키를 사용하세요.
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      alert("위시리스트에 학교를 추가했습니다.");
    },

    // mutation 실패 시 실행될 콜백
    onError: (error) => {
      const errorMessage = (error as any)?.response?.data?.message || "요청에 실패했습니다.";
      console.error("위시리스트 추가 실패:", errorMessage);
      alert(errorMessage || "요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};

export default usePostUniversityFavorite;
