import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { scoresApi, CreateGpaResponse, CreateGpaRequest } from "./api";

const usePostCreateGpa = () => {
  return useMutation<CreateGpaResponse, AxiosError, CreateGpaRequest>({
    mutationFn: (data) => scoresApi.postCreateGpa({ data }),
  });
};

export default usePostCreateGpa;