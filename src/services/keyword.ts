import axios from "axios";
import { AxiosResponse } from "axios";

export const getPopularKeywordsApi = (): Promise<AxiosResponse<string[]>> => {
  return axios.get("/api/keywords");
};

export const postSearchKeywordApi = (keyword: string): Promise<AxiosResponse<string>> => {
  return axios.post("/api/keywords", { keyword });
};
