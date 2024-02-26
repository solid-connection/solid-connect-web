import axios from "axios";
import Cookies from "js-cookie";

export async function refreshAccessToken(refreshToken: string): Promise<void> {
  try {
    const refreshResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          withCredentials: true,
        },
      }
    );
    const accessToken: string = refreshResponse.data.data.accessToken;
    Cookies.set("accessToken", accessToken, { expires: 1, secure: true, sameSite: "strict" }); // 새 accessToken을 쿠키에 저장
  } catch (error) {
    throw new Error("refresh token이 유효하지 않음");
  }
}

export default function createApiClient() {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config: any) => {
      let accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (!accessToken && refreshToken) {
        // access token 없을 때 refresh token으로 재발급 시도
        await refreshAccessToken(refreshToken);
        accessToken = Cookies.get("accessToken");
      }

      if (accessToken) {
        // access token이 있을 때
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
      if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = Cookies.get("refreshToken");
          if (!refreshToken) {
            // document.location.href = "/login";
            return Promise.reject(error);
          }
          await refreshAccessToken(refreshToken);
          const accessToken = Cookies.get("accessToken");

          originalRequest.headers["Authorization"] = "Bearer " + accessToken;
          return axios(originalRequest);
        } catch (refreshError) {
          // document.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
}
