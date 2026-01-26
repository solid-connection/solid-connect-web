import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { myPageApi, ProfileResponse, ProfileRequest } from "./api";

const usePatchProfile = () => {
  return useMutation<ProfileResponse, AxiosError, ProfileRequest>({
    mutationFn: (data) => myPageApi.patchProfile({ data }),
  });
};

export default usePatchProfile;