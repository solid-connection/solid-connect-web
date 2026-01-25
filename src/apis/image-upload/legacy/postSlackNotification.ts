import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { imageUploadApi, type SlackNotificationRequest, type SlackNotificationResponse } from "./api";

const usePostSlackNotification = () => {
  return useMutation<SlackNotificationResponse, AxiosError, SlackNotificationRequest>({
    mutationFn: (data) => imageUploadApi.postSlackNotification({ data }),
  });
};

export default usePostSlackNotification;
