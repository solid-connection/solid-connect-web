import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 멘토만 요청 가능Api, 나의 멘토 페이지 수정Response, 나의 멘토 페이지 수정Request } from "./api";

const usePut나의 멘토 페이지 수정 = () => {
  return useMutation<나의 멘토 페이지 수정Response, AxiosError, 나의 멘토 페이지 수정Request>({
    mutationFn: (data) => 멘토만 요청 가능Api.put나의 멘토 페이지 수정({ data }),
  });
};

export default usePut나의 멘토 페이지 수정;