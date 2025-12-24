import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const getByRegionCountry = async (params: { params?: Record<string, any> }): Promise<GetByRegionCountryResponse> => {
  const res = await axiosInstance.get<GetByRegionCountryResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetByRegionCountry = (params?: Record<string, any>) => {
  return useQuery<GetByRegionCountryResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getByRegionCountry, params],
    queryFn: () => getByRegionCountry({ params }),
  });
};

export default useGetByRegionCountry;