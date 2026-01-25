import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { image UploadApi, 학적 성적표 업로드Response, 학적 성적표 업로드Request } from "./api";

const usePost학적 성적표 업로드 = () => {
  return useMutation<학적 성적표 업로드Response, AxiosError, 학적 성적표 업로드Request>({
    mutationFn: (data) => image UploadApi.post학적 성적표 업로드({ data }),
  });
};

export default usePost학적 성적표 업로드;