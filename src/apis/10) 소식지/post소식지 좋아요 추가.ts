import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 10) 소식지Api, 소식지 좋아요 추가Response, 소식지 좋아요 추가Request } from "./api";

const usePost소식지 좋아요 추가 = () => {
  return useMutation<소식지 좋아요 추가Response, AxiosError, { newsId: string | number; data: 소식지 좋아요 추가Request }>({
    mutationFn: (variables) => 10) 소식지Api.post소식지 좋아요 추가(variables),
  });
};

export default usePost소식지 좋아요 추가;