import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { myPageApi, InterestedRegionCountryResponse, InterestedRegionCountryRequest } from "./api";

const usePatchInterestedRegionCountry = () => {
  return useMutation<InterestedRegionCountryResponse, AxiosError, InterestedRegionCountryRequest>({
    mutationFn: (data) => myPageApi.patchInterestedRegionCountry({ data }),
  });
};

export default usePatchInterestedRegionCountry;