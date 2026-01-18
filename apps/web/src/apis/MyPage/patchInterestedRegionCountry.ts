import { AxiosError } from "axios";

import { InterestedRegionCountryRequest, InterestedRegionCountryResponse, myPageApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePatchInterestedRegionCountry = () => {
  return useMutation<InterestedRegionCountryResponse, AxiosError, InterestedRegionCountryRequest>({
    mutationFn: (data) => myPageApi.patchInterestedRegionCountry(data),
  });
};

export default usePatchInterestedRegionCountry;
