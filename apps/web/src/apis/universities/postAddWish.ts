import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { universitiesApi, AddWishResponse, AddWishRequest } from "./api";

const usePostAddWish = () => {
  return useMutation<AddWishResponse, AxiosError, { univApplyInfoId: string | number; data: AddWishRequest }>({
    mutationFn: (variables) => universitiesApi.postAddWish(variables),
  });
};

export default usePostAddWish;