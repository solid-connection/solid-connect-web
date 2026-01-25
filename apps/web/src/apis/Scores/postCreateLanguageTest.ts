import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { scoresApi, CreateLanguageTestResponse, CreateLanguageTestRequest } from "./api";

const usePostCreateLanguageTest = () => {
  return useMutation<CreateLanguageTestResponse, AxiosError, CreateLanguageTestRequest>({
    mutationFn: (data) => scoresApi.postCreateLanguageTest({ data }),
  });
};

export default usePostCreateLanguageTest;