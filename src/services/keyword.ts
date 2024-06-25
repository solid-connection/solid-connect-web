import axios from "axios";
import { AxiosResponse } from "axios";

export const getPopularKeywordsApi = (): Promise<AxiosResponse<string[]>> => axios.get("/api/keywords");

export const postSearchKeywordApi = (keyword: string): Promise<AxiosResponse<string>> => axios.post("/api/keywords", { keyword });
