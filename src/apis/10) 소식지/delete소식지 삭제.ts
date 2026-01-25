import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 10) 소식지Api, 소식지 삭제Response, 소식지 삭제Request } from "./api";

const useDelete소식지 삭제 = () => {
  return useMutation<소식지 삭제Response, AxiosError, { newsId: string | number; data: 소식지 삭제Request }>({
    mutationFn: (variables) => 10) 소식지Api.delete소식지 삭제(variables),
  });
};

export default useDelete소식지 삭제;