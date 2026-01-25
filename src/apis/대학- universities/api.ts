import { axiosInstance } from "@/utils/axiosInstance";

export type 권역국가에 해당하는 전체 대학Response = void;

export const 대학 universitiesApi = {
  get권역국가에 해당하는 전체 대학: async (params: { params?: Record<string, any> }): Promise<권역국가에 해당하는 전체 대학Response> => {
    const res = await axiosInstance.get<권역국가에 해당하는 전체 대학Response>(
      `/universities/search`, { params: params?.params }
    );
    return res.data;
  },

};