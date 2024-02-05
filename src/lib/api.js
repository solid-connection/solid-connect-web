import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WEB_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = coo;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
