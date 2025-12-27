import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { imageUploadApi, SlackNotificationResponse, SlackNotificationRequest } from "./api";

const usePostSlackNotification = () => {
  return useMutation<SlackNotificationResponse, AxiosError, SlackNotificationRequest>({
    mutationFn: (data) => imageUploadApi.postSlackNotification({ data }),
  });
};

export default usePostSlackNotification;