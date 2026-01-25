import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 10) 소식지Api, 소식지 추가Response, 소식지 추가Request } from "./api";

const usePost소식지 추가 = () => {
  return useMutation<소식지 추가Response, AxiosError, 소식지 추가Request>({
    mutationFn: (data) => 10) 소식지Api.post소식지 추가({ data }),
  });
};

export default usePost소식지 추가;