import axios, { AxiosResponse } from "axios";

export const getPopularKeywordsPublicApi = (): Promise<AxiosResponse<string[]>> => axios.get("/api/keywords");

export const postSearchKeywordPublicApi = (keyword: string): Promise<AxiosResponse<string>> =>
  axios.post("/api/keywords", { keyword });
