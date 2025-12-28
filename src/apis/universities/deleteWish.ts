import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { universitiesApi, WishResponse } from "./api";
import { QueryKeys } from "../queryKeys";

/**
 * @description 위시리스트에서 학교를 삭제하는 useMutation 커스텀 훅
 */
const useDeleteWish = () => {
  const queryClient = useQueryClient();

  return useMutation<WishResponse, AxiosError, number>({
    mutationFn: (universityInfoForApplyId) =>
      universitiesApi.deleteWish({ univApplyInfoId: universityInfoForApplyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.universities.wishList] });
    },
  });
};

export default useDeleteWish;