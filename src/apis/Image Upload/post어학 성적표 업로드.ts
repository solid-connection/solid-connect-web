import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { image UploadApi, 어학 성적표 업로드Response, 어학 성적표 업로드Request } from "./api";

const usePost어학 성적표 업로드 = () => {
  return useMutation<어학 성적표 업로드Response, AxiosError, 어학 성적표 업로드Request>({
    mutationFn: (data) => image UploadApi.post어학 성적표 업로드({ data }),
  });
};

export default usePost어학 성적표 업로드;