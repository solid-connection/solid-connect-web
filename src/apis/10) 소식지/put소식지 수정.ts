import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 10) 소식지Api, 소식지 수정Response, 소식지 수정Request } from "./api";

const usePut소식지 수정 = () => {
  return useMutation<소식지 수정Response, AxiosError, { newsId: string | number; data: 소식지 수정Request }>({
    mutationFn: (variables) => 10) 소식지Api.put소식지 수정(variables),
  });
};

export default usePut소식지 수정;