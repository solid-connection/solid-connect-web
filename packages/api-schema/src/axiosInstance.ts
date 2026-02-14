import axios, { type AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
