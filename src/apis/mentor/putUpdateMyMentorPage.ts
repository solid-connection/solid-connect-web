import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mentorApi, UpdateMyMentorPageResponse, UpdateMyMentorPageRequest } from "./api";

const usePutUpdateMyMentorPage = () => {
  return useMutation<UpdateMyMentorPageResponse, AxiosError, UpdateMyMentorPageRequest>({
    mutationFn: (data) => mentorApi.putUpdateMyMentorPage({ data }),
  });
};

export default usePutUpdateMyMentorPage;