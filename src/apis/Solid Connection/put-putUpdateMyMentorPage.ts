import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PutUpdateMyMentorPageRequest {
  // TODO: Define request type
}

export interface PutUpdateMyMentorPageResponse {

}

const putUpdateMyMentorPage = async (params: { data?: PutUpdateMyMentorPageRequest }): Promise<PutUpdateMyMentorPageResponse> => {
  const res = await axiosInstance.put<PutUpdateMyMentorPageResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePutUpdateMyMentorPage = () => {
  return useMutation<PutUpdateMyMentorPageResponse, AxiosError, PutUpdateMyMentorPageRequest>({
    mutationFn: (data) => putUpdateMyMentorPage({ data }),
  });
};

export default usePutUpdateMyMentorPage;