import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { universitiesApi, WishResponse, WishRequest } from "./api";

const useDeleteWish = () => {
  return useMutation<WishResponse, AxiosError, { univApplyInfoId: string | number; data: WishRequest }>({
    mutationFn: (variables) => universitiesApi.deleteWish(variables),
  });
};

export default useDeleteWish;