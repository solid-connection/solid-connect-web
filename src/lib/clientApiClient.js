import axios from "axios";
import Cookies from "js-cookie";

export default function createApiClient() {
  // Configure Axios with interceptors in a separate module or the same file
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
    withCredentials: true,
  });

  // Request interceptor for API calls
  apiClient.interceptors.request.use(
    async (config) => {
      let accessToken;
      if (config.headers.Authorization) {
        accessToken = config.headers.Authorization.split(" ")[1];
      } else {
        accessToken = Cookies.get("accessToken");
      }
      const refreshToken = Cookies.get("refreshToken");

      if (!accessToken && refreshToken) {
        // access token 없을 때 refresh token으로 재발급 시도
        try {
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                withCredentials: true,
                // withCredentials: true,
              },
            }
          );
          accessToken = refreshResponse.data.data.accessToken;
          Cookies.set("accessToken", accessToken, { expires: 1, secure: true, sameSite: "strict" }); // 새 accessToken을 쿠키에 저장

          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
            // withCredentials: true,
          };
        } catch (error) {
          console.error("access token 발급중 오류", error);
          return Promise.reject(error);
        }
      } else if (accessToken) {
        // access token이 있을 때
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
          // withCredentials: true,
        };
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = Cookies.get("refreshToken");
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json",
                withCredentials: true,
              },
            }
          );
          const newAccessToken = refreshResponse.data.data.accessToken;

          Cookies.set("accessToken", newAccessToken, { expires: 1, secure: true, sameSite: "strict" });

          // apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("accessToken 무효로 재발급중 오류:", refreshError);
          return Promise.reject(refreshError); // Or handle a redirect to login
        }
      }
      return Promise.reject(error);
    }
  );
  return apiClient;
}
