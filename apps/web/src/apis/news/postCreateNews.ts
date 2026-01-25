import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { newsApi, CreateNewsResponse, CreateNewsRequest } from "./api";

const usePostCreateNews = () => {
  return useMutation<CreateNewsResponse, AxiosError, CreateNewsRequest>({
    mutationFn: (data) => newsApi.postCreateNews({ data }),
  });
};

export default usePostCreateNews;