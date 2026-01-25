import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 3) 마이페이지Api, 비밀번호 변경Response, 비밀번호 변경Request } from "./api";

const usePatch비밀번호 변경 = () => {
  return useMutation<비밀번호 변경Response, AxiosError, 비밀번호 변경Request>({
    mutationFn: (data) => 3) 마이페이지Api.patch비밀번호 변경({ data }),
  });
};

export default usePatch비밀번호 변경;