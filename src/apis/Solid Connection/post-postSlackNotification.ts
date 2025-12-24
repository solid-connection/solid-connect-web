import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PostSlackNotificationRequest {
  // TODO: Define request type
}

export interface PostSlackNotificationResponse {
  // TODO: Define response type
}

const postSlackNotification = async (params: { data?: PostSlackNotificationRequest }): Promise<PostSlackNotificationResponse> => {
  const res = await axiosInstance.post<PostSlackNotificationResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePostSlackNotification = () => {
  return useMutation<PostSlackNotificationResponse, AxiosError, PostSlackNotificationRequest>({
    mutationFn: (data) => postSlackNotification({ data }),
  });
};

export default usePostSlackNotification;