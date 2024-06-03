import axios from "axios";
import Cookies from "js-cookie";

export default function createApiClient() {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config: any) => {
      let accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        // access token 없을 때 refresh token으로 재발급 시도
        await fetch(`/api/auth/token/refresh`, {
          method: "POST",
        });
        accessToken = Cookies.get("accessToken");
      }

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 || error.response.status === 403) {
        await fetch(`/api/auth/token/refresh`, {
          method: "POST",
        });
        const accessToken: string = Cookies.get("accessToken");
        if (!accessToken) {
          document.location.href = "/login";
        }
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  return instance;
}
