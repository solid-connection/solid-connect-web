import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ApplicationPreviewResponse } from "@/types/application";
import { ApplicationsQueryKeys, applicationsApi } from "./api";

const useGetApplicationPreview = () => {
  return useQuery<ApplicationPreviewResponse, AxiosError<{ message: string }>>({
    queryKey: [ApplicationsQueryKeys.applicationPreview],
    queryFn: async () => {
      const response = await applicationsApi.getApplicationPreview();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetApplicationPreview;
