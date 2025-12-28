import { AxiosError } from "axios";

import { SlackNotificationRequest, SlackNotificationResponse, imageUploadApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostSlackNotification = () => {
  return useMutation<SlackNotificationResponse, AxiosError, SlackNotificationRequest>({
    mutationFn: (data) => imageUploadApi.postSlackNotification({ data }),
  });
};

export default usePostSlackNotification;
