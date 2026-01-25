import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 멘토만 요청 가능Api, 멘토링 수락거절Response, 멘토링 수락거절Request } from "./api";

const usePatch멘토링 수락거절 = () => {
  return useMutation<멘토링 수락거절Response, AxiosError, { mentoringId: string | number; data: 멘토링 수락거절Request }>({
    mutationFn: (variables) => 멘토만 요청 가능Api.patch멘토링 수락거절(variables),
  });
};

export default usePatch멘토링 수락거절;