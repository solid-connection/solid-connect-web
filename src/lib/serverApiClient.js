import axios from "axios";

export default function createApiClient(req, res) {
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
        accessToken = req.cookies["accessToken"]; // Ensure this is accessible or passed appropriately
      }
      const refreshToken = req.cookies["refreshToken"];

      if (!accessToken && refreshToken) {
        // access token 없을 때 refresh token으로 재발급 시도
        try {
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
            {},
            {
              headers: {
                ...config.headers,
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          accessToken = refreshResponse.data.data.accessToken;
          // res.setHeader("Set-Cookie", `accessToken=${accessToken}; Domain=.solid-connect.net; Path=/; Secure; SameSite=Strict; Max-Age=3600`);
          res.setHeader("Set-Cookie", `accessToken=${accessToken}; Path=/; SameSite=Strict; Max-Age=3600`);

          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            withCredentials: true,
          };
        } catch (error) {
          console.error("access token 발급중 오류\n", error);
          return Promise.reject(error);
        }
      } else if (accessToken) {
        // access token이 있을 때
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
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
          const refreshToken = req.cookies["refreshToken"];
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

          // res.setHeader("Set-Cookie", `accessToken=${newAccessToken}; Domain=.solid-connect.net; Path=/; Secure; SameSite=Strict; Max-Age=3600`);
          res.setHeader("Set-Cookie", `accessToken=${newAccessToken}; Path=/; SameSite=Strict; Max-Age=3600`);

          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("accessToken 무효로 재발급중 오류:\n", refreshError);
          return Promise.reject(refreshError); // Or handle a redirect to login
        }
      }
      console.log("뭔가 오류:\n", error);
      return Promise.reject(error);
    }
  );
  return apiClient;
}
