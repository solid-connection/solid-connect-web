import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type InterestedRegionCountryRequest, type InterestedRegionCountryResponse, myPageApi } from "./api";

const usePatchInterestedRegionCountry = () => {
  return useMutation<InterestedRegionCountryResponse, AxiosError, InterestedRegionCountryRequest>({
    mutationFn: (data) => myPageApi.patchInterestedRegionCountry(data),
  });
};

export default usePatchInterestedRegionCountry;
