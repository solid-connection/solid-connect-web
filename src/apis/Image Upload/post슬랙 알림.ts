import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { image UploadApi, 슬랙 알림Response, 슬랙 알림Request } from "./api";

const usePost슬랙 알림 = () => {
  return useMutation<슬랙 알림Response, AxiosError, 슬랙 알림Request>({
    mutationFn: (data) => image UploadApi.post슬랙 알림({ data }),
  });
};

export default usePost슬랙 알림;