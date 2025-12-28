import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { universitiesApi, AddWishResponse } from "./api";
import { QueryKeys } from "../queryKeys";
import { createMutationErrorHandler } from "@/utils/errorHandler";

/**
 * @description 위시리스트에 학교를 추가하는 useMutation 커스텀 훅
 */
const usePostAddWish = () => {
  const queryClient = useQueryClient();

  return useMutation<AddWishResponse, AxiosError, number>({
    mutationFn: (universityInfoForApplyId) =>
      universitiesApi.postAddWish({ univApplyInfoId: universityInfoForApplyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.universities.wishList] });
    },
    onError: createMutationErrorHandler("위시리스트 추가에 실패했습니다."),
  });
};

export default usePostAddWish;