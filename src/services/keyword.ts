import axios from "axios";
import { AxiosResponse } from "axios";

export const getPopularKeywordsPublicApi = (): Promise<AxiosResponse<string[]>> => {
  return axios.get("/api/keywords");
};

export const postSearchKeywordPublicApi = (keyword: string): Promise<AxiosResponse<string>> => {
  return axios.post("/api/keywords", { keyword });
};
