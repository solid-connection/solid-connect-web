import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mentorApi, CreateMentorMyPageResponse, CreateMentorMyPageRequest } from "./api";

const usePostCreateMentorMyPage = () => {
  return useMutation<CreateMentorMyPageResponse, AxiosError, CreateMentorMyPageRequest>({
    mutationFn: (data) => mentorApi.postCreateMentorMyPage({ data }),
  });
};

export default usePostCreateMentorMyPage;