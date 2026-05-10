import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type AddWishResponse, universitiesApi } from "./api";

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
  });
};

export default usePostAddWish;
