import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 3) 마이페이지Api, 관심 권역국가 변경Response, 관심 권역국가 변경Request } from "./api";

const usePatch관심 권역국가 변경 = () => {
  return useMutation<관심 권역국가 변경Response, AxiosError, 관심 권역국가 변경Request>({
    mutationFn: (data) => 3) 마이페이지Api.patch관심 권역국가 변경({ data }),
  });
};

export default usePatch관심 권역국가 변경;