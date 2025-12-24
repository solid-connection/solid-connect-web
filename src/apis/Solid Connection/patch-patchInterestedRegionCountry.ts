import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PatchInterestedRegionCountryRequest {
  // TODO: Define request type
}

const patchInterestedRegionCountry = async (params: { data?: PatchInterestedRegionCountryRequest }): Promise<PatchInterestedRegionCountryResponse> => {
  const res = await axiosInstance.patch<PatchInterestedRegionCountryResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePatchInterestedRegionCountry = () => {
  return useMutation<PatchInterestedRegionCountryResponse, AxiosError, PatchInterestedRegionCountryRequest>({
    mutationFn: (data) => patchInterestedRegionCountry({ data }),
  });
};

export default usePatchInterestedRegionCountry;